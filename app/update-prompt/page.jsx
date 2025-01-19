"use client";

import Form from "@components/Form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

const EditPrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [promptId, setPromptId] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams) {
      const id = searchParams.get("id");
      setPromptId(id || null);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const getPromptDetails = async () => {
      if (promptId) {
        setLoading(true);
        try {
          const response = await fetch(`/api/prompt/${promptId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPost({ prompt: data.prompt, tag: data.tag });
        } catch (error) {
          console.error("Error fetching prompt details:", error);
        } finally {
          setLoading(false);
          setSubmitting(false);
        }
      }
    };
    getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!promptId) return alert("Prompt ID not found");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading prompt details...</div>;
  }

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPrompt />
    </Suspense>
  );
}
