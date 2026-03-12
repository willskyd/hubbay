"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({
  orderId,
  existingRating,
  existingComment,
}: {
  orderId: string;
  existingRating?: number | null;
  existingComment?: string | null;
}) {
  const [rating, setRating] = useState(existingRating ?? 5);
  const [comment, setComment] = useState(existingComment ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submitReview = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, rating, comment }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      setMessage(data.message || data.error || "Saved.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-5">
      <h3 className="text-lg font-semibold text-hubbay-text">Rate Your Experience</h3>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)}>
            <Star
              size={20}
              className={
                star <= rating ? "fill-hubbay-gold text-hubbay-gold" : "text-hubbay-secondary"
              }
            />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Tell HubBay how your order tasted..."
      />
      <Button onClick={submitReview} disabled={loading}>
        {loading ? "Saving..." : "Submit review"}
      </Button>
      {message ? <p className="text-sm text-hubbay-secondary">{message}</p> : null}
    </div>
  );
}
