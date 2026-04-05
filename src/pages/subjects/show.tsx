import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Subject } from "@/types";
import { useShow } from "@refinedev/core";
import { BookOpen, Building2, Calendar, GraduationCap } from "lucide-react";

const SubjectShow = () => {
    const { query } = useShow<Subject & { classCount?: number }>({ resource: 'subjects' });

    const subject = query?.data?.data;
    const { isLoading, isError } = query;

    if (isLoading || isError || !subject) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader title="Subject Details" resource="subjects" />
                <p className="state-message">
                    {isLoading ? 'Loading subject details....'
                        : isError ? 'Failed to load subject details'
                            : 'Subject not found'}
                </p>
            </ShowView>
        )
    }

    return (
        <ShowView className="class-view">
            <ShowViewHeader title="Subject Details" resource="subjects" />

            <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold">{subject.name}</h1>
                            <Badge>{subject.code}</Badge>
                        </div>
                        <p className="text-muted-foreground">{subject.description || 'No description provided.'}</p>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p className="font-semibold">{subject.department?.name ?? '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Classes</p>
                            <p className="font-semibold">{subject.classCount ?? 0}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="font-semibold">{subject.createdAt ? new Date(subject.createdAt).toLocaleDateString() : '—'}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </ShowView>
    )
}

export default SubjectShow
