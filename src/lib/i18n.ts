export type Locale = "en" | "fr";

export const translations = {
	en: {
		// Header
		export: "Export",
		import: "Import",

		// CV List Page
		myCvs: "My CVs",
		newCv: "New CV",
		loadDemo: "Load Demo Data",
		deleteConfirmTitle: "Delete CV",
		deleteConfirmDesc: "Are you sure you want to delete this CV? This action cannot be undone.",
		cancel: "Cancel",
		delete: "Delete",
		noCvsTitle: "No CVs yet",
		noCvsDesc: "Create your first tailored CV to get started.",

		// Builder toolbar
		reset: "Reset",
		save: "Save",
		resetConfirmTitle: "Reset changes",
		resetConfirmDesc: "This will discard all unsaved changes and revert to the last saved version. Are you sure?",
		leaveConfirmTitle: "Unsaved changes",
		leaveConfirmDesc: "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
		discardLeave: "Discard & Leave",

		// KnowledgePanel
		knowledgeBase: "Knowledge Base",
		profile: "Profile",
		cvTitles: "CV Titles",
		introductions: "Introductions",
		skills: "Skills",
		experiences: "Experiences",
		education: "Education",
		certifications: "Certifications",

		// ProfileEditor
		name: "Name",
		email: "Email",
		phone: "Phone",
		location: "Location",
		linkedin: "LinkedIn",
		github: "GitHub",

		// EducationEditor
		addEducation: "Add education",
		editEducation: "Edit Education",
		newEducation: "Add Education",
		degree: "Degree",
		institution: "Institution",
		period: "Period",
		details: "Details (one per line, optional)",
		degreePlaceholder: "e.g. Master of Computer Science",
		periodPlaceholder: "2018 - 2020",
		detailsPlaceholder: "Honours, specialization...",
		noEducation: "No education yet.",

		// CertificationEditor
		addCertification: "Add certification",
		editCertification: "Edit Certification",
		newCertification: "Add Certification",
		certName: "Certification Name",
		issuer: "Issuer",
		date: "Date",
		expiryDate: "Expiry Date (optional)",
		credentialId: "Credential ID (optional)",
		certNamePlaceholder: "e.g. AWS Solutions Architect",
		issuerPlaceholder: "e.g. Amazon Web Services",
		datePlaceholder: "e.g. March 2024",
		noCertifications: "No certifications yet.",

		// CvPreview sections
		summary: "Summary",
		experience: "Experience",
		tech: "Tech",

		// Common
		add: "Add",
		saveBtn: "Save",
		notFound: "Page not found",
		backHome: "Back to home",
		cvNotFound: "CV not found",
		goBackToList: "Go back to list",
		startBuilding: "Start building your CV by adding content in the side panel.",
		long: "Long",
	},
	fr: {
		// Header
		export: "Exporter",
		import: "Importer",

		// CV List Page
		myCvs: "Mes CVs",
		newCv: "Nouveau CV",
		loadDemo: "Charger les données démo",
		deleteConfirmTitle: "Supprimer le CV",
		deleteConfirmDesc: "Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.",
		cancel: "Annuler",
		delete: "Supprimer",
		noCvsTitle: "Aucun CV",
		noCvsDesc: "Créez votre premier CV personnalisé pour commencer.",

		// Builder toolbar
		reset: "Réinitialiser",
		save: "Enregistrer",
		resetConfirmTitle: "Réinitialiser les modifications",
		resetConfirmDesc: "Cela annulera toutes les modifications non sauvegardées et reviendra à la dernière version enregistrée. Êtes-vous sûr ?",
		leaveConfirmTitle: "Modifications non sauvegardées",
		leaveConfirmDesc: "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ? Vos modifications seront perdues.",
		discardLeave: "Ignorer et quitter",

		// KnowledgePanel
		knowledgeBase: "Base de connaissances",
		profile: "Profil",
		cvTitles: "Titres de CV",
		introductions: "Introductions",
		skills: "Compétences",
		experiences: "Expériences",
		education: "Formation",
		certifications: "Certifications",

		// ProfileEditor
		name: "Nom",
		email: "Email",
		phone: "Téléphone",
		location: "Localisation",
		linkedin: "LinkedIn",
		github: "GitHub",

		// EducationEditor
		addEducation: "Ajouter une formation",
		editEducation: "Modifier la formation",
		newEducation: "Ajouter une formation",
		degree: "Diplôme",
		institution: "Établissement",
		period: "Période",
		details: "Détails (un par ligne, optionnel)",
		degreePlaceholder: "ex. Master Informatique",
		periodPlaceholder: "2018 - 2020",
		detailsPlaceholder: "Mention, spécialisation...",
		noEducation: "Aucune formation.",

		// CertificationEditor
		addCertification: "Ajouter une certification",
		editCertification: "Modifier la certification",
		newCertification: "Ajouter une certification",
		certName: "Nom de la certification",
		issuer: "Organisme",
		date: "Date d'obtention",
		expiryDate: "Date d'expiration (optionnel)",
		credentialId: "ID de certification (optionnel)",
		certNamePlaceholder: "ex. AWS Solutions Architect",
		issuerPlaceholder: "ex. Amazon Web Services",
		datePlaceholder: "ex. Mars 2024",
		noCertifications: "Aucune certification.",

		// CvPreview sections
		summary: "Résumé",
		experience: "Expérience",
		tech: "Technologies",

		// Common
		add: "Ajouter",
		saveBtn: "Enregistrer",
		notFound: "Page introuvable",
		backHome: "Retour à l'accueil",
		cvNotFound: "CV introuvable",
		goBackToList: "Retour à la liste",
		startBuilding: "Commencez à construire votre CV en ajoutant du contenu dans le panneau latéral.",
		long: "Long",
	},
} as const;

export type TranslationKey = keyof typeof translations.en;
