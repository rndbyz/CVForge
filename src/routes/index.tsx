import { createFileRoute } from "@tanstack/react-router";
import { CvListPage } from "@/components/cv-list";

export const Route = createFileRoute("/")({ component: CvListPage });
