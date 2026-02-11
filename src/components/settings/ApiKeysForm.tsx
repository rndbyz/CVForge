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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useApiKeys } from "@/hooks";
import { type ApiKeys, apiKeysSchema, defaultApiKeys } from "@/lib/schemas";

const PROVIDER_OPTIONS = [
	{ value: "openai", label: "OpenAI" },
	{ value: "anthropic", label: "Anthropic" },
] as const;

export function ApiKeysForm() {
	const [apiKeys, setApiKeys] = useApiKeys();

	const form = useForm<ApiKeys>({
		resolver: zodResolver(apiKeysSchema),
		defaultValues: defaultApiKeys,
	});

	useEffect(() => {
		form.reset(apiKeys);
	}, [apiKeys, form]);

	function onSubmit(data: ApiKeys) {
		setApiKeys(data);
		toast.success("API keys saved.");
	}

	return (
		<div className="space-y-4">
			{/* Security warning */}
			<div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">
				<strong>Security notice:</strong> API keys are stored in your browser's
				localStorage. This is acceptable for personal use. Do not use this on
				shared or public devices. For a production environment, use a backend
				proxy instead.
			</div>

			<Card>
				<CardHeader>
					<CardTitle>API Keys &amp; Provider</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
							{/* Active Provider */}
							<FormField
								control={form.control}
								name="provider"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Active Provider</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select provider" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{PROVIDER_OPTIONS.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Model Name */}
							<FormField
								control={form.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Model</FormLabel>
										<FormControl>
											<Input
												placeholder="gpt-4o / claude-opus-4-5-20250929"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Separator />

							{/* OpenAI Key */}
							<FormField
								control={form.control}
								name="openai"
								render={({ field }) => (
									<FormItem>
										<FormLabel>OpenAI API Key</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="sk-..."
												autoComplete="off"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Anthropic Key */}
							<FormField
								control={form.control}
								name="anthropic"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Anthropic API Key</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="sk-ant-..."
												autoComplete="off"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end pt-2">
								<Button type="submit">Save Keys</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
