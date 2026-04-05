import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm as useRefineForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { subjectSchema } from "@/lib/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useList } from "@refinedev/core";
import { SaveIcon, BookOpen } from "lucide-react";
import { Department } from "@/types";

type SubjectFormValues = z.infer<typeof subjectSchema>;

const SubjectEdit = () => {
    const form = useRefineForm<any, any, SubjectFormValues>({
        resolver: zodResolver(subjectSchema) as Resolver<SubjectFormValues>,
        refineCoreProps: {
            resource: 'subjects',
            action: 'edit',
            redirect: 'list',
        },
    });

    const {
        refineCore: { onFinish, formLoading, query },
        saveButtonProps,
        control,
        handleSubmit,
    } = form;

    const { data: departmentsData, isLoading: deptLoading } = useList<Department>({
        resource: 'departments',
        pagination: { pageSize: 100 },
    });

    const departments = departmentsData?.data || [];
    const isLoading = query?.isLoading;

    if (isLoading) {
        return (
            <EditView className="container max-w-2xl py-6 space-y-8">
                <EditViewHeader title="Edit Subject" />
                <p className="text-muted-foreground">Loading subject details...</p>
            </EditView>
        );
    }

    return (
        <EditView className="container max-w-2xl py-6 space-y-8">
            <EditViewHeader title="Edit Subject" />

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Subject Details</CardTitle>
                            <CardDescription>Update the subject information.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <Separator className="bg-white/5" />
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Subject Code</FormLabel>
                                            <FormControl>
                                                <Input className="bg-background/50 border-white/10" placeholder="e.g. CS101" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Subject Name</FormLabel>
                                            <FormControl>
                                                <Input className="bg-background/50 border-white/10" placeholder="e.g. Introduction to CS" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name="departmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Department</FormLabel>
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background/50 border-white/10">
                                                    <SelectValue placeholder="Select a department" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()} disabled={deptLoading}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description of the subject..."
                                                className="min-h-[100px] bg-background/50 border-white/10 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={formLoading}
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

export default SubjectEdit
