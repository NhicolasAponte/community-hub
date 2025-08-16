"use client";
import React, { useState } from "react";
import NewsletterForm from "@/components/forms/newsletter-form";
import NewsletterTable from "./newsletter-table";
import { Newsletter } from "@/lib/data-model/schema-types";

import Modal from "@/components/cards/modal";
import { NewsletterFormData } from "@/lib/zod-schema/form-schema";
import {
  createNewsletter,
  deleteNewsletter,
  updateNewsletter,
} from "@/lib/data/newsletter-actions";

interface NewsletterAdminControllerProps {
  newsletters: Newsletter[];
}

const NewsletterAdminController: React.FC<NewsletterAdminControllerProps> = ({
  newsletters,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string>();
  const [newsletterFields, setNewsletterFields] =
    useState<NewsletterFormData>();

  const handleEdit = (newsletter: Newsletter) => {
    setIsEditOpen(true);
    setSelectedNewsletterId(newsletter.id);
    setNewsletterFields({
      title: newsletter.title,
      content: newsletter.content,
      date: newsletter.date,
    });
  };

  const handleDelete = (newsletterId: string) => {
    deleteNewsletter(newsletterId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Create Newsletter
        </button>
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">
            Create Newsletter
          </h3>
          <NewsletterForm
            action={createNewsletter}
            closeForm={() => setIsCreateOpen(false)}
          />
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">
            Edit Newsletter
          </h3>
          <NewsletterForm
            defaultValues={newsletterFields}
            action={(data) => updateNewsletter(selectedNewsletterId!, data)}
            closeForm={() => setIsEditOpen(false)}
          />
        </div>
      </Modal>

      <NewsletterTable
        newsletters={newsletters}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NewsletterAdminController;
