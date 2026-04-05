import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm as useRefineForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { classSchema } from "@/lib/schema";
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
import { SaveIcon, Terminal } from "lucide-react";
import UploadWidget from "@/components/upload_widget";
import { Subject, User } from "@/types";

type ClassFormValues = z.infer<typeof classSchema>;

const ClassEdit = () => {
    const form = useRefineForm<any, any, ClassFormValues>({
        resolver: zodResolver(classSchema) as Resolver<ClassFormValues>,
        refineCoreProps: {
            resource: 'classes',
            action: 'edit',
            redirect: 'show',
        },
    });

    const {
        refineCore: { onFinish, formLoading, query },
        saveButtonProps,
        formState: { errors },
        control,
        handleSubmit,
    } = form;

    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: { pageSize: 100 }
    });

    const { query: teachersQuery } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
        pagination: { pageSize: 100 }
    });

    const subjects = subjectsQuery?.data?.data || [];
    const subjectsLoading = subjectsQuery.isLoading;
    const teachers = teachersQuery?.data?.data || [];
    const teachersLoading = teachersQuery.isLoading;
    const isLoading = query?.isLoading;

    const bannerPublicId = form.watch("bannerCldPubId");

    const setBannerImage = (file: any, field: any) => {
        if (file) {
            field.onChange(file.url);
            form.setValue('bannerCldPubId', file.publicId, { shouldValidate: true, shouldDirty: true });
        } else {
            field.onChange('');
            form.setValue('bannerCldPubId', '', { shouldValidate: true, shouldDirty: true });
        }
    }

    if (isLoading) {
        return (
            <EditView className="container max-w-4xl py-6 space-y-8">
                <EditViewHeader title="Edit Class" />
                <p className="text-muted-foreground">Loading class details...</p>
            </EditView>
        );
    }

    return (
        <EditView className="container max-w-4xl py-6 space-y-8">
            <EditViewHeader title="Edit Class" />

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-white/10">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Class Details</CardTitle>
                            <CardDescription>Update the class information.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <Separator className="bg-white/5" />
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={control} name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Class Name</FormLabel>
                                            <FormControl><Input className="bg-background/50 border-white/10" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={control} name="capacity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Capacity</FormLabel>
                                            <FormControl><Input type="number" className="bg-background/50 border-white/10" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField control={control} name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Description</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-[120px] bg-background/50 border-white/10 resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={control} name="subjectId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Subject</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                <FormControl><SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {subjects.map((s) => (
                                                        <SelectItem key={s.id} value={s.id.toString()} disabled={subjectsLoading}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={control} name="teacherId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Assigned Teacher</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger className="bg-background/50 border-white/10"><SelectValue placeholder="Assign a teacher" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {teachers.map((t) => (
                                                        <SelectItem key={t.id} value={t.id.toString()} disabled={teachersLoading}>{t.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={control} name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger className="bg-background/50 border-white/10"><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField control={control} name="bannerUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Upload Image</FormLabel>
                                            <FormControl>
                                                <UploadWidget
                                                    value={field.value ? { url: field.value, publicId: bannerPublicId ?? '' } : null}
                                                    onChange={(file: any) => setBannerImage(file, field)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            {errors.bannerCldPubId && !errors.bannerUrl && (
                                                <p className="text-red-500 text-sm">{errors.bannerCldPubId.message?.toString()}</p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Button type="submit"
                                    className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                                    {...saveButtonProps}
                                >
                                    {formLoading ? "Saving..." : (
                                        <span className="flex items-center gap-2"><SaveIcon className="w-4 h-4" /> Save Changes</span>
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

export default ClassEdit
