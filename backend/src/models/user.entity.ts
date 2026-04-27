import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Video } from "./video.entity.js";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", nullable: false })
    username!: string;

    @Column({ type: "varchar", unique: true, nullable: false })
    email!: string;

    @Column({ type: "varchar", nullable: false })
    password!: string;

    @Column({ type: "varchar", nullable: true })
    refreshToken?: string;

    @OneToMany(() => Video, (video) => video.user)
    videos?: Video[];
}
