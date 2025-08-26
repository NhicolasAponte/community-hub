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
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-medium text-foreground">Newsletter Management</h2>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 text-sm sm:text-base rounded-md hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          Create Newsletter
        </button>
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} fullScreenOnDesktop={true}>
        <div className="bg-card rounded-lg w-full h-full flex flex-col p-2">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-card-foreground pr-8 flex-shrink-0">
            Create Newsletter
          </h3>
          <div className="flex-1 overflow-y-auto px-2">
            <NewsletterForm
              action={createNewsletter}
              closeForm={() => setIsCreateOpen(false)}
            />
          </div>
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} fullScreenOnDesktop={true}>
        <div className="bg-card rounded-lg w-full h-full flex flex-col p-2">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-card-foreground pr-8 flex-shrink-0">
            Edit Newsletter
          </h3>
          <div className="flex-1 overflow-y-auto px-2">
            <NewsletterForm
              defaultValues={newsletterFields}
              action={(data) => updateNewsletter(selectedNewsletterId!, data)}
              closeForm={() => setIsEditOpen(false)}
            />
          </div>
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
