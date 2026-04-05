import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { useShow } from "@refinedev/core";
import { Mail, Shield, Calendar } from "lucide-react";

const UserShow = () => {
    const { query } = useShow<User>({ resource: 'users' });

    const userData = query?.data?.data;
    const { isLoading, isError } = query;

    if (isLoading || isError || !userData) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader title="User Profile" resource="users" />
                <p className="state-message">
                    {isLoading ? 'Loading user details....'
                        : isError ? 'Failed to load user details'
                            : 'User not found'}
                </p>
            </ShowView>
        )
    }

    const roleVariant = userData.role === 'admin' ? 'destructive' as const : userData.role === 'teacher' ? 'default' as const : 'secondary' as const;

    return (
        <ShowView className="class-view">
            <ShowViewHeader title="User Profile" resource="users" />

            <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={userData.image} />
                        <AvatarFallback className="text-2xl">{userData.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold">{userData.name}</h1>
                            <Badge variant={roleVariant}>{userData.role}</Badge>
                        </div>
                        <p className="text-muted-foreground">{userData.email}</p>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-sm">{userData.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Email Verified</p>
                            <p className="font-semibold text-sm">{userData.emailVerified ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Joined</p>
                            <p className="font-semibold text-sm">{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '—'}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </ShowView>
    )
}

export default UserShow
