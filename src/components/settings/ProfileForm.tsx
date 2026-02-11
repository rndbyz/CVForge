import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks";
import { type Header, headerSchema } from "@/lib/schemas";

export function ProfileForm() {
	const [profile, setProfile] = useProfile();

	const form = useForm<Header>({
		resolver: zodResolver(headerSchema),
		defaultValues: {
			name: "",
			title: "",
			email: "",
			phone: "",
			location: "",
			linkedin: "",
			github: "",
		},
	});

	// Sync form when localStorage data hydrates
	useEffect(() => {
		form.reset({
			name: profile.name,
			title: profile.title,
			email: profile.email,
			phone: profile.phone,
			location: profile.location,
			linkedin: profile.linkedin ?? "",
			github: profile.github ?? "",
		});
	}, [profile, form]);

	function onSubmit(data: Header) {
		setProfile(data);
		toast.success("Profile saved successfully.");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="Jane Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Job Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Senior Software Engineer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="jane@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input placeholder="+1 555 000 0000" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location</FormLabel>
										<FormControl>
											<Input placeholder="New York, NY" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="linkedin"
								render={({ field }) => (
									<FormItem>
										<FormLabel>LinkedIn URL</FormLabel>
										<FormControl>
											<Input
												placeholder="https://linkedin.com/in/janedoe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="github"
								render={({ field }) => (
									<FormItem>
										<FormLabel>GitHub URL</FormLabel>
										<FormControl>
											<Input
												placeholder="https://github.com/janedoe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end pt-2">
							<Button type="submit">Save Profile</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
