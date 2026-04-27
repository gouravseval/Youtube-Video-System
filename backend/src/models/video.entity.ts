import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity.js";

@Entity({ name: "videos" })
export class Video {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", nullable: false })
    fileName!: string;

    @Column({ type: "varchar", nullable: false })
    name!: string;

    @Column({ type: "varchar", nullable: false })
    link!: string;

    @Column({ type: "uuid", nullable: true })
    user_id?: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.videos, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user?: User;
}
