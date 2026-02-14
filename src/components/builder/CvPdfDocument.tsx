import {
	Document,
	Page,
	Path,
	StyleSheet,
	Svg,
	Text,
	View,
} from "@react-pdf/renderer";
import type { ResolvedCV } from "@/hooks/use-resolved-cv";
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS } from "@/lib/schemas";

/* ---- Lucide-style SVG icons for PDF ---- */
const ICON_SIZE = 9;

function MailIcon() {
	return (
		<Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
			<Path
				d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
				stroke="#9ca3af"
				strokeWidth={2}
				fill="none"
			/>
			<Path d="M22 6l-10 7L2 6" stroke="#9ca3af" strokeWidth={2} fill="none" />
		</Svg>
	);
}

function PhoneIcon() {
	return (
		<Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
			<Path
				d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
				stroke="#9ca3af"
				strokeWidth={2}
				fill="none"
			/>
		</Svg>
	);
}

function MapPinIcon() {
	return (
		<Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
			<Path
				d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
				stroke="#9ca3af"
				strokeWidth={2}
				fill="none"
			/>
			<Path
				d="M12 10a3 3 0 100-6 3 3 0 000 6z"
				stroke="#9ca3af"
				strokeWidth={2}
				fill="none"
			/>
		</Svg>
	);
}

function GlobeIcon() {
	return (
		<Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
			<Path
				d="M12 2a10 10 0 100 20 10 10 0 000-20z"
				stroke="#9ca3af"
				strokeWidth={2}
				fill="none"
			/>
			<Path d="M2 12h20" stroke="#9ca3af" strokeWidth={2} fill="none" />
			<Path
				d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
				stroke="#9ca3af"
				strokeWidth={2}
				fill="none"
			/>
		</Svg>
	);
}

function GithubIcon() {
	return (
		<Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
			<Path
				d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
				stroke="#9ca3af"
				strokeWidth={2}
				fill="none"
			/>
		</Svg>
	);
}

const mm = (v: number) => `${v}mm`;

const styles = StyleSheet.create({
	page: {
		paddingTop: mm(15),
		paddingBottom: mm(15),
		paddingHorizontal: mm(18),
		backgroundColor: "#ffffff",
		fontFamily: "Helvetica",
		fontSize: 10,
		color: "#1f2937",
		lineHeight: 1.4,
	},

	/* ---- Header ---- */
	header: {
		marginBottom: 10,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		textAlign: "center",
	},
	name: {
		fontSize: 22,
		fontFamily: "Helvetica-Bold",
		color: "#111827",
	},
	title: {
		fontSize: 12,
		color: "#6b7280",
		marginTop: 2,
	},
	contactRow: {
		flexDirection: "row",
		justifyContent: "center",
		flexWrap: "wrap",
		gap: 10,
		marginTop: 5,
		fontSize: 8,
		color: "#9ca3af",
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},

	/* ---- Sections ---- */
	section: {
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 8,
		fontFamily: "Helvetica-Bold",
		color: "#6b7280",
		textTransform: "uppercase",
		letterSpacing: 1,
		marginBottom: 4,
	},
	bodyText: {
		fontSize: 10,
		color: "#374151",
	},

	/* ---- Skills ---- */
	skillRow: {
		flexDirection: "row",
		gap: 4,
		marginBottom: 2,
	},
	skillCategory: {
		fontFamily: "Helvetica-Bold",
		color: "#374151",
	},
	skillItems: {
		color: "#4b5563",
	},

	/* ---- Experience ---- */
	expEntry: {
		marginBottom: 6,
	},
	expHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	expTitle: {
		fontFamily: "Helvetica-Bold",
		fontSize: 10,
		color: "#111827",
	},
	expCompany: {
		fontSize: 10,
		color: "#6b7280",
	},
	expPeriod: {
		fontSize: 8,
		color: "#9ca3af",
	},
	bulletList: {
		marginTop: 2,
		paddingLeft: 12,
	},
	bullet: {
		flexDirection: "row",
		marginBottom: 1,
	},
	bulletDot: {
		width: 8,
		fontSize: 10,
		color: "#6b7280",
	},
	bulletText: {
		flex: 1,
		fontSize: 9,
		color: "#4b5563",
	},
	techLine: {
		marginTop: 2,
		fontSize: 8,
		color: "#9ca3af",
	},

	/* ---- Education ---- */
	eduEntry: {
		marginBottom: 4,
	},
	eduHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	eduDegree: {
		fontFamily: "Helvetica-Bold",
		fontSize: 10,
		color: "#111827",
	},
	eduInstitution: {
		fontSize: 10,
		color: "#6b7280",
	},
});

export function CvPdfDocument({ resolved }: { resolved: ResolvedCV }) {
	const { profile, title, introduction, skills, experiences, education } =
		resolved;

	const skillsByCategory = SKILL_CATEGORIES.map((cat) => ({
		category: SKILL_CATEGORY_LABELS[cat],
		items: skills.filter((s) => s.category === cat),
	})).filter((group) => group.items.length > 0);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				{profile.name && (
					<View style={styles.header}>
						<Text style={styles.name}>{profile.name}</Text>
						{title && <Text style={styles.title}>{title}</Text>}
						<View style={styles.contactRow}>
							{profile.email && (
								<View style={styles.contactItem}>
									<MailIcon />
									<Text>{profile.email}</Text>
								</View>
							)}
							{profile.phone && (
								<View style={styles.contactItem}>
									<PhoneIcon />
									<Text>{profile.phone}</Text>
								</View>
							)}
							{profile.location && (
								<View style={styles.contactItem}>
									<MapPinIcon />
									<Text>{profile.location}</Text>
								</View>
							)}
							{profile.linkedin && (
								<View style={styles.contactItem}>
									<GlobeIcon />
									<Text>{profile.linkedin}</Text>
								</View>
							)}
							{profile.github && (
								<View style={styles.contactItem}>
									<GithubIcon />
									<Text>{profile.github}</Text>
								</View>
							)}
						</View>
					</View>
				)}

				{/* Summary */}
				{introduction && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Summary</Text>
						<Text style={styles.bodyText}>{introduction}</Text>
					</View>
				)}

				{/* Skills */}
				{skillsByCategory.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Skills</Text>
						{skillsByCategory.map((group) => (
							<View key={group.category} style={styles.skillRow}>
								<Text style={styles.skillCategory}>
									{group.category}:
								</Text>
								<Text style={styles.skillItems}>
									{group.items.map((s) => s.name).join(", ")}
								</Text>
							</View>
						))}
					</View>
				)}

				{/* Experience */}
				{experiences.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Experience</Text>
						{experiences.map((exp, i) => (
							<View
								key={`${exp.company}-${i}`}
								style={styles.expEntry}
								wrap={false}
							>
								<View style={styles.expHeader}>
									<View style={{ flexDirection: "row", flex: 1 }}>
										<Text style={styles.expTitle}>
											{exp.selectedTitle}
										</Text>
										<Text style={styles.expCompany}>
											{" "}
											— {exp.company}
											{exp.location ? `, ${exp.location}` : ""}
										</Text>
									</View>
									<Text style={styles.expPeriod}>{exp.period}</Text>
								</View>

								{exp.selectedBullets.length > 0 && (
									<View style={styles.bulletList}>
										{exp.selectedBullets.map((bullet) => (
											<View key={bullet} style={styles.bullet}>
												<Text style={styles.bulletDot}>•</Text>
												<Text style={styles.bulletText}>{bullet}</Text>
											</View>
										))}
									</View>
								)}

								{exp.tech && exp.tech.length > 0 && (
									<Text style={styles.techLine}>
										Tech: {exp.tech.join(", ")}
									</Text>
								)}
							</View>
						))}
					</View>
				)}

				{/* Education */}
				{education.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Education</Text>
						{education.map((edu) => (
							<View key={edu.id} style={styles.eduEntry} wrap={false}>
								<View style={styles.eduHeader}>
									<View style={{ flexDirection: "row", flex: 1 }}>
										<Text style={styles.eduDegree}>{edu.degree}</Text>
										<Text style={styles.eduInstitution}>
											{" "}
											— {edu.institution}
										</Text>
									</View>
									<Text style={styles.expPeriod}>{edu.period}</Text>
								</View>

								{edu.details && edu.details.length > 0 && (
									<View style={styles.bulletList}>
										{edu.details.map((d) => (
											<View key={d} style={styles.bullet}>
												<Text style={styles.bulletDot}>•</Text>
												<Text style={styles.bulletText}>{d}</Text>
											</View>
										))}
									</View>
								)}
							</View>
						))}
					</View>
				)}
			</Page>
		</Document>
	);
}
