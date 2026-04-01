import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { classSchema } from "@/lib/schema";
import { z } from 'zod'
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
import { useSelect } from "@refinedev/core";
import { SaveIcon, Terminal, GraduationCap } from "lucide-react";
import { teachers as staticTeachers } from "@/constants";
import UploadWidget from "@/components/upload_widget";

type ClassFormValues = z.infer<typeof classSchema>;

const ClassCreate = () => {
    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema) as any,
        refineCoreProps: {
            resource: 'classes',
            action: 'create',
            redirect: 'list',
        },
        defaultValues: {
            status: 'active',
            capacity: 30,
            bannerUrl: '',
            bannerCldPubId: '',
        },
    });

    const {
        refineCore: { onFinish, formLoading },
        saveButtonProps,
        formState: { isSubmitting, errors },
        control,
        handleSubmit,
        watch,
    } = form;

    const name = watch("name");
    const description = watch("description");
    const capacity = watch("capacity");

    const { options: subjectOptions } = useSelect({
        resource: "subjects",
        optionLabel: "name",
        optionValue: "id",
    });

    const { options: teacherOptions } = useSelect({
        resource: "faculty",
        optionLabel: "name",
        optionValue: "id",
    });

    // Use static teachers if no faculty resource found (for dev/demo)
    const combinedTeacherOptions = (teacherOptions && teacherOptions.length > 0)
        ? teacherOptions
        : staticTeachers.map(t => ({ label: t.name, value: t.id }));

    const bannerPublicId = form.watch("bannerCldPubId");

    const setBannerImage = (file, field) => {
        if (file) {
            field.onChange(file.url);
            form.setValue('bannerCldPubId', file.publicId, {
                shouldValidate: true,
                shouldDirty: true
            });
        } else {
            field.onChange('');
            form.setValue('bannerCldPubId', '', {
                shouldValidate: true,
                shouldDirty: true,
            })
        }
    }

    return (
        <CreateView className="container max-w-4xl py-6 space-y-8">
            <CreateViewHeader title="Register New Class" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-white/10 ring-1 ring-white/10">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Class Details</CardTitle>
                                    <CardDescription>Enter the essential information to create a new classroom session.</CardDescription>
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
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground font-medium small uppercase tracking-wider">Class Name</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-background/50 border-white/10 focus:ring-primary/20 transition-all duration-200" placeholder="e.g. Advanced Physics 101" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name="capacity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground font-medium small uppercase tracking-wider">Capacity</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="bg-background/50 border-white/10 focus:ring-primary/20 transition-all duration-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-muted-foreground font-medium small uppercase tracking-wider">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Provide a detailed overview of the class curriculum..."
                                                        className="min-h-[120px] bg-background/50 border-white/10 focus:ring-primary/20 transition-all duration-200 resize-none px-4 py-3"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={control}
                                            name="subjectId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground font-medium small uppercase tracking-wider">Subject</FormLabel>
                                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-background/50 border-white/10">
                                                                <SelectValue placeholder="Select a subject" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {subjectOptions?.map((option) => (
                                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                                    {option.label}
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
                                            name="teacherId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground font-medium small uppercase tracking-wider">Assigned Teacher</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-background/50 border-white/10">
                                                                <SelectValue placeholder="Assign a teacher" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {combinedTeacherOptions.map((option) => (
                                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={control}
                                            name="bannerUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground font-medium small uppercase tracking-wider">Upload Image </FormLabel>
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
                                        <FormField
                                            control={control}
                                            name="bannerCldPubId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-muted-foreground font-medium small uppercase tracking-wider">Banner</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-background/50 border-white/10" placeholder="...." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={formLoading}
                                            className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                                            {...saveButtonProps}
                                        >
                                            {formLoading ? "Creating..." : (
                                                <span className="flex items-center gap-2">
                                                    <SaveIcon className="w-4 h-4" /> Create Class
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm border-white/10 ring-1 ring-white/10 overflow-hidden">
                        <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GraduationCap className="w-12 h-12 text-primary/40" />
                            </div>
                        </div>
                        <CardHeader className="pt-4">
                            <CardTitle className="text-lg">Class Preview</CardTitle>
                            <CardDescription>How the class will appear to students on their dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl border border-white/5 bg-background/30 backdrop-blur-md">
                                <h4 className="font-bold text-primary truncate">
                                    {name || "Untitled Class"}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {description || "No description provided yet."}
                                </p>
                                <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                                    <span>{capacity} Students Max</span>
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Active</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CreateView>
    );
};

export default ClassCreate;