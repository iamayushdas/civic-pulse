'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, MessageSquare, RotateCcw, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { Card, CardContent, CardHeader } from './Card';
import { Input, Textarea } from './Input';
import { useTranslation } from '@/lib/i18n';

interface Comment {
  _id?: string;
  authorName: string;
  body: string;
  createdAt: string;
}

interface ComplaintEngagementProps {
  complaintId: string;
  status: string;
  confirmationCount?: number;
}

export default function ComplaintEngagement({
  complaintId,
  status,
  confirmationCount = 0,
}: ComplaintEngagementProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [confirmations, setConfirmations] = useState(confirmationCount);
  const [confirmed, setConfirmed] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ authorName: '', authorEmail: '', body: '' });
  const { t } = useTranslation();

  useEffect(() => {
    const storedKey = window.localStorage.getItem(`civic-voter-${complaintId}`);
    setConfirmed(Boolean(storedKey));

    fetch(`/api/complaints/${complaintId}/comments`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setComments(data?.comments || []))
      .catch((error) => console.error('Failed to fetch comments:', error));
  }, [complaintId]);

  const confirmIssue = async () => {
    const voterKey = window.localStorage.getItem(`civic-voter-${complaintId}`) || crypto.randomUUID();
    window.localStorage.setItem(`civic-voter-${complaintId}`, voterKey);

    const response = await fetch(`/api/complaints/${complaintId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterKey }),
    });
    const data = await response.json();
    if (response.ok) {
      setConfirmed(true);
      setConfirmations(data.count || confirmations + 1);
    }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/complaints/${complaintId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: form.authorName,
          authorEmail: form.authorEmail || undefined,
          body: form.body,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add comment');
      setComments((current) => [data.comment, ...current]);
      setForm({ authorName: '', authorEmail: '', body: '' });
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Could not add your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reopenComplaint = async () => {
    setReopening(true);
    try {
      const response = await fetch(`/api/complaints/${complaintId}/reopen`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to reopen complaint');
      router.refresh();
    } catch (error) {
      console.error('Failed to reopen complaint:', error);
      alert('Could not reopen this complaint. Please try again.');
    } finally {
      setReopening(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="label-mono mb-1">{t('confirmIssue')}</div>
            <div className="text-2xl font-bold">{confirmations} {t('peopleReportThisToo')}</div>
          </div>
          <Button variant={confirmed ? 'ghost' : 'primary'} onClick={confirmIssue} disabled={confirmed}>
            <CheckCircle2 size={18} />
            {confirmed ? t('confirmed') : t('confirmIssue')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <MessageSquare size={22} /> {t('publicUpdatesComments')}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={submitComment} className="space-y-4 border-b-2 border-civic-black pb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label={t('contact')}
                value={form.authorName}
                onChange={(event) => setForm({ ...form, authorName: event.target.value })}
                required
              />
              <Input
                label="EMAIL (OPTIONAL)"
                type="email"
                value={form.authorEmail}
                onChange={(event) => setForm({ ...form, authorEmail: event.target.value })}
              />
            </div>
            <Textarea
              label={t('description')}
              value={form.body}
              onChange={(event) => setForm({ ...form, body: event.target.value })}
              placeholder="Share a useful update about this issue..."
              rows={3}
              required
            />
            <Button type="submit" variant="ghost" disabled={submitting}>
              <Send size={16} />
              {submitting ? t('posting') : t('postComment')}
            </Button>
          </form>

          {comments.length > 0 ? comments.map((comment) => (
            <div key={comment._id || `${comment.authorName}-${comment.createdAt}`} className="border-b-2 border-civic-black/15 pb-4 last:border-0">
              <div className="flex items-center justify-between gap-4">
                <div className="font-bold">{comment.authorName}</div>
                <div className="label-mono text-xs">{new Date(comment.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{comment.body}</p>
            </div>
          )) : (
            <div className="text-sm text-civic-muted">{t('noPublicComments')}</div>
          )}
        </CardContent>
      </Card>

      {status === 'RESOLVED' && (
        <Button variant="ghost" block onClick={reopenComplaint} disabled={reopening}>
          <RotateCcw size={18} />
          {reopening ? t('reopening') : t('reopenIssue')}
        </Button>
      )}
    </div>
  );
}
