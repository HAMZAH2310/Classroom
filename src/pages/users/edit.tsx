import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm as useRefineForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { userEditSchema } from "@/lib/schema";
import { z } from 'zod'
import { Resolver } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaveIcon, UserCog } from "lucide-react";

type UserEditFormValues = z.infer<typeof userEditSchema>;

const UserEdit = () => {
    const form = useRefineForm<any, any, UserEditFormValues>({
        resolver: zodResolver(userEditSchema) as Resolver<UserEditFormValues>,
        refineCoreProps: {
            resource: 'users',
            action: 'edit',
            redirect: 'show',
        },
    });

    const {
        refineCore: { onFinish, formLoading, query },
        saveButtonProps,
        control,
        handleSubmit,
    } = form;

    const isLoading = query?.isLoading;

    if (isLoading) {
        return (
            <EditView className="container max-w-2xl py-6 space-y-8">
                <EditViewHeader title="Edit User" />
                <p className="text-muted-foreground">Loading user details...</p>
            </EditView>
        );
    }

    return (
        <EditView className="container max-w-2xl py-6 space-y-8">
            <EditViewHeader title="Edit User" />

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <UserCog className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">User Details</CardTitle>
                            <CardDescription>Update the user's information and role.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <Separator className="bg-white/5" />
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Full Name</FormLabel>
                                        <FormControl>
                                            <Input className="bg-background/50 border-white/10" placeholder="Enter full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Role</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background/50 border-white/10">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="teacher">Teacher</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                                    {...saveButtonProps}
                                >
                                    {formLoading ? "Saving..." : (
                                        <span className="flex items-center gap-2">
                                            <SaveIcon className="w-4 h-4" /> Save Changes
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </EditView>
    );
};

export default UserEdit
