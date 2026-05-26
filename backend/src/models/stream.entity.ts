import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity.js";

@Entity({ name: 'streams' })
export class Stream {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    streamKey!: string;

    @Column({ type: "varchar", nullable: true })
    title!: string;

    @Column({ type: "boolean", default: false })
    is_live!: boolean;

    @Column({ type: "uuid", nullable: false })
    user_id!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user?: User;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}