import { EntitySchema } from "typeorm";

export const VideoEntity = new EntitySchema({
    name: "Video",
    tableName: "videos",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        fileName: {
            type: "varchar",
            nullable: false,
        },
        name: {
            type: "varchar",
            nullable: false,
        },
        link: {
            type: "varchar",
            nullable: false,
        },
        user_id: {
            type: "uuid",
            nullable: true,
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "user_id" },
            onDelete: "CASCADE",
        },
    },
});
