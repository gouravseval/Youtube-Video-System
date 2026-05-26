import NodeMediaServer from "node-media-server";
import { AppDataSource } from "../db/data-source.js";
import { Stream } from "../models/stream.entity.js";

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8012,
    mediaroot: "./media",
    allow_origin: "*",
  },
};

export const nms = new NodeMediaServer(config);

nms.on('prePublish', async (id: string, StreamPath: string, args: any) => {
  console.log("[NMS] Pre publish streampath:", StreamPath);

  const streamKey = StreamPath.split("/")[2];
  console.log("[NMS] Extracted Stream key:", streamKey);

  if (!streamKey) {
    console.log("[NMS] No stream key provided. Rejecting.");
    nms.getSession(id).clear();
    return;
  }

  try {
    const streamRepo = AppDataSource.getRepository(Stream);
    const activeStream = await streamRepo.findOne({ where: { streamKey: streamKey } });

    if (!activeStream) {
      console.log(`[NMS] Invalid Stream Key '${streamKey}'. Connection Rejected!`);
      nms.getSession(id).clear();
    } else {
      console.log(`[NMS] Valid Stream Key! Marking stream as LIVE.`);
      activeStream.is_live = true;
      await streamRepo.save(activeStream);
    }
  } catch (error) {
    console.error("[NMS] Database error validating stream key:", error);
    nms.getSession(id).clear();
  }
});

nms.on('donePublish', async (id: string, StreamPath: string, args: any) => {
  const streamKey = StreamPath.split("/")[2];
  if (!streamKey) return;

  try {
    const streamRepo = AppDataSource.getRepository(Stream);
    const activeStream = await streamRepo.findOne({ where: { streamKey: streamKey } });

    if (activeStream) {
      console.log(`[NMS] Stream ended for key '${streamKey}'. Marking as offline.`);
      activeStream.is_live = false;
      await streamRepo.save(activeStream);
    }
  } catch (error) {
    console.error("[NMS] Error updating stream offline status:", error);
  }
});
