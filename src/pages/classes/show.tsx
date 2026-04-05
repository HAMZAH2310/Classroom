import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ClassDetails, User } from "@/types";
import { Separator } from "@/components/ui/separator";
import { useShow, useList } from "@refinedev/core";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/claudinary";
import { Progress } from "@/components/ui/progress";
import { Users, Copy, CheckCircle, BookOpen, Building2, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

const ClassesShow = () => {
    const { query } = useShow<ClassDetails>({ resource: 'classes' });
    const [codeCopied, setCodeCopied] = useState(false);

    const classDetails = query?.data?.data;
    const { isLoading, isError } = query;

    // Fetch enrolled students
    const studentsQuery = useList<User>({
        resource: `classes/${classDetails?.id}/users`,
        filters: [{ field: 'role', operator: 'eq', value: 'student' }],
        pagination: { pageSize: 50 },
        queryOptions: { enabled: !!classDetails?.id },
    });
    
    const studentsData = studentsQuery?.query?.data;

    const copyInviteCode = () => {
        if (classDetails?.inviteCode) {
            navigator.clipboard.writeText(classDetails.inviteCode);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2000);
        }
    };

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader title="Class Details" resource="classes" />
                <p className="state-message">
                    {isLoading ? 'Loading class details....'
                        : isError ? 'Failed to load class details'
                            : 'Class details not found'}
                </p>
            </ShowView>
        )
    }

    const teacherName = classDetails.teacher?.name ?? 'unknown';
    const teachersInitials = teacherName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    const enrollmentCount = classDetails.enrollmentCount ?? 0;
    const capacityPercent = classDetails.capacity > 0 ? Math.round((enrollmentCount / classDetails.capacity) * 100) : 0;
    const enrolledStudents = studentsData?.data ?? [];

    return (
        <div>
            <ShowView className="class-view class-show">
                <ShowViewHeader title="Class Details" resource="classes" />

                {/* Banner */}
                <div className="banner rounded-xl overflow-hidden">
                    {classDetails.bannerUrl ? (
                        <AdvancedImage alt="Class Banner" cldImg={bannerPhoto(classDetails.bannerCldPubId ?? '', classDetails.name)} />
                    ) : <div className="placeholder h-48 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-xl" />}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold">{classDetails.name}</h1>
                                    <p className="text-muted-foreground mt-1">{classDetails.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline">{classDetails.capacity} spots</Badge>
                                    <Badge variant={classDetails.status === 'active' ? 'default' : 'secondary'}>
                                        {classDetails.status?.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={classDetails.teacher?.image} />
                                        <AvatarFallback>{teachersInitials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Instructor</p>
                                        <p className="font-semibold">{teacherName}</p>
                                        <p className="text-xs text-muted-foreground">{classDetails.teacher?.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm"><strong>{classDetails.subject?.name}</strong> ({classDetails.subject?.code})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{classDetails.department?.name ?? '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Enrolled Students */}
                        <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Enrolled Students</h3>
                                </div>
                                <Badge variant="outline">{enrollmentCount} / {classDetails.capacity}</Badge>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                    <span>Capacity</span>
                                    <span>{capacityPercent}%</span>
                                </div>
                                <Progress value={capacityPercent} className="h-2" />
                                {capacityPercent >= 90 && (
                                    <p className="text-xs text-destructive mt-1 font-medium">⚠ This class is almost full!</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                {enrolledStudents.length > 0 ? (
                                    enrolledStudents.map((student: any) => (
                                        <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={student.image} />
                                                    <AvatarFallback>{student.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="text-xs">Student</Badge>
                                                <DeleteButton 
                                                    resource="enrollments" 
                                                    recordItemId={student.enrollmentId} 
                                                    variant="ghost" 
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </DeleteButton>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No students enrolled yet.</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Invite Code */}
                        <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Invite Code</h3>
                            <div className="p-4 rounded-xl bg-background/50 border border-white/5 text-center">
                                <p className="text-3xl font-mono font-bold tracking-[0.3em] text-primary">
                                    {classDetails.inviteCode ?? '—'}
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={copyInviteCode}
                                    disabled={!classDetails.inviteCode}
                                >
                                    {codeCopied ? (
                                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Copied!</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Code</span>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 text-center">
                                Share this code with students to join the class.
                            </p>
                        </Card>

                        {/* How to Join */}
                        <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">How to Join</h3>
                            <ol className="space-y-3 text-sm">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</span>
                                    <span className="text-muted-foreground">Get the invite code from your teacher</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
                                    <span className="text-muted-foreground">Enter the code when joining a class</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</span>
                                    <span className="text-muted-foreground">Click "Join" to enroll</span>
                                </li>
                            </ol>
                        </Card>
                    </div>
                </div>
            </ShowView>
        </div>
    )
}

export default ClassesShow