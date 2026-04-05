import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Department } from "@/types";
import { useShow, useList } from "@refinedev/core";
import { Building2, BookOpen, Calendar } from "lucide-react";

const DepartmentShow = () => {
    const { query } = useShow<Department>({ resource: 'departments' });

    const department = query?.data?.data;
    const { isLoading, isError } = query;

    const { data: subjectsData } = useList({
        resource: 'subjects',
        filters: [
            { field: 'department', operator: 'eq', value: department?.name ?? '' }
        ],
        pagination: { pageSize: 50 },
        queryOptions: { enabled: !!department?.name },
    });

    if (isLoading || isError || !department) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader title="Department Details" resource="departments" />
                <p className="state-message">
                    {isLoading ? 'Loading department details....'
                        : isError ? 'Failed to load department details'
                            : 'Department not found'}
                </p>
            </ShowView>
        )
    }

    return (
        <ShowView className="class-view">
            <ShowViewHeader title="Department Details" resource="departments" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-bold">{department.name}</h1>
                                    <Badge>{department.code}</Badge>
                                </div>
                                <p className="text-muted-foreground">{department.description || 'No description provided.'}</p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Subjects</p>
                                    <p className="text-lg font-bold">{department.subjectCount ?? 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="text-lg font-bold">{department.createdAt ? new Date(department.createdAt).toLocaleDateString() : '—'}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Subjects in this Department</h3>
                        <div className="space-y-3">
                            {subjectsData?.data && subjectsData.data.length > 0 ? (
                                subjectsData.data.map((subject: any) => (
                                    <div key={subject.id} className="p-3 rounded-lg bg-background/50 border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm">{subject.name}</span>
                                            <Badge variant="outline" className="text-xs">{subject.code}</Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No subjects yet.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </ShowView>
    )
}

export default DepartmentShow
