"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

import { databases, account, ID } from "@/config/appwrite";

const NewDocumentPage = () => {
	const [loading, setLoading] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		fetchUserId().catch((error) => {
			alert("Failed to fetch user ID: " + error);
		});
	}, []);

	const fetchUserId = async () => {
		try {
			const user = await account.get();

			setUserId(user.$id);
		} catch (error) {
			throw new Error("Failed to fetch user ID");
		}
	};

	const createNewDocument = async () => {
		if (!userId) {
			alert("User ID is not available");

			return;
		}

		setLoading(true);
		try {
			const response = await databases.createDocument(
				process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
				process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
				ID.unique(),
				{ title: "Untitled Document", content: "", userId: userId },
			);

			router.push(`/dashboard/docs_management/${userId}/${response.$id}`);
		} catch (error) {
			alert("Failed to create document");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Create New Document</h1>
			<Button
				color="primary"
				isLoading={loading}
				variant="flat"
				onClick={createNewDocument}
			>
				Create Document
			</Button>
		</div>
	);
};

export default NewDocumentPage;
