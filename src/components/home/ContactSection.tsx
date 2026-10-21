"use client";

import React, { useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  MessageSquare,
  Reply,
  Send,
  ShieldCheck,
} from "lucide-react";
import { feedbackConfig } from "@/data/contact";
import { profileData } from "@/data/profile";
import { useCopyEmail } from "@/lib/useCopyEmail";

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success" }
  | { status: "error"; message: string };

const MAX_MESSAGE_LENGTH = 2000;

export function ContactSection() {
  const { copied, copyEmail } = useCopyEmail(profileData.links.email);
  const honeyRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState.status === "sending") return;

    // 蜜罐字段只对机器人可见，命中时静默丢弃，不发送请求。
    if (honeyRef.current?.value) {
      setSubmitState({ status: "success" });
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail || !trimmedMessage) {
      setSubmitState({
        status: "error",
        message: "请填写你的邮箱和反馈内容。",
      });
      return;
    }

    setSubmitState({ status: "sending" });

    try {
      const response = await fetch(feedbackConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName || "未署名",
          email: trimmedEmail,
          message: trimmedMessage,
          _replyto: trimmedEmail,
          _subject: feedbackConfig.subject,
          _template: "table",
          _captcha: "false",
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: string | boolean; message?: string }
        | null;

      const succeeded =
        response.ok &&
        (data?.success === undefined ||
          data.success === true ||
          data.success === "true");

      if (!succeeded) {
        throw new Error(data?.message || "发送失败");
      }

      setName("");
      setEmail("");
      setMessage("");
      setSubmitState({ status: "success" });
    } catch {
      setSubmitState({
        status: "error",
        message: `发送失败，请稍后重试，或直接发送邮件到 ${profileData.links.email}。`,
      });
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Contact
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            给我留一条反馈
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-right">
          发现问题、想聊一个想法，或者只是打个招呼，都可以直接写在这里。
        </p>
      </div>

      <div className="glass-panel-subtle rounded-2xl p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-10">
          <div className="flex flex-col">
            <h3 className="text-base font-medium text-white">
              内容会以邮件送达我的邮箱
            </h3>
            <p className="mt-3 text-[13px] leading-[1.8] text-slate-300">
              填写表单并提交，你的反馈会直接发到我的邮箱；你填写的邮箱会一并附上，方便我回复。
            </p>

            <ul className="mt-5 space-y-3 text-xs leading-relaxed text-slate-400">
              <li className="flex items-start gap-2.5">
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                反馈会发送到我的邮箱，不在本站公开。
              </li>
              <li className="flex items-start gap-2.5">
                <Reply className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                回复会直接发到你填写的邮箱。
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                本站不保存提交内容，表单由 FormSubmit 转发。
              </li>
            </ul>

            <div className="mt-6 xl:mt-auto xl:pt-8">
              <button
                type="button"
                onClick={copyEmail}
                title={
                  copied
                    ? "邮箱已复制"
                    : `复制邮箱 ${profileData.links.email}`
                }
                aria-label={copied ? "邮箱已复制" : "复制邮箱地址"}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 text-xs text-slate-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-muted" />
                  <span className="truncate">
                    {copied ? "邮箱已复制" : profileData.links.email}
                  </span>
                </span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                ) : (
                  <Copy className="h-3.5 w-3.5 shrink-0 text-muted" />
                )}
              </button>
            </div>
          </div>

          <form
            action={feedbackConfig.endpoint.replace("/ajax/", "/")}
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-5 xl:border-l xl:border-white/[0.06] xl:pl-10"
          >
            <input
              type="hidden"
              name="_subject"
              value={feedbackConfig.subject}
            />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />

            <div
              aria-hidden="true"
              className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor="feedback-honey">请留空</label>
              <input
                ref={honeyRef}
                id="feedback-honey"
                name="_honey"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="feedback-name"
                  className="block text-xs font-medium text-slate-300"
                >
                  你的称呼 <span className="text-muted">（可选）</span>
                </label>
                <input
                  id="feedback-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={60}
                  autoComplete="name"
                  placeholder="怎么称呼你"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-accent/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="feedback-email"
                  className="block text-xs font-medium text-slate-300"
                >
                  你的邮箱 <span className="text-accent">*</span>
                </label>
                <input
                  id="feedback-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-describedby="feedback-email-hint"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-accent/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-accent/20"
                />
                <p
                  id="feedback-email-hint"
                  className="text-[11px] leading-relaxed text-muted"
                >
                  会随反馈一起发给我，仅用于回复。
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="feedback-message"
                  className="block text-xs font-medium text-slate-300"
                >
                  反馈内容 <span className="text-accent">*</span>
                </label>
                <span className="font-mono text-[11px] tabular-nums text-muted">
                  {message.length} / {MAX_MESSAGE_LENGTH}
                </span>
              </div>
              <textarea
                id="feedback-message"
                name="message"
                required
                rows={5}
                maxLength={MAX_MESSAGE_LENGTH}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="想说什么都可以，比如发现的问题、建议或合作想法。"
                className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3 text-sm leading-[1.8] text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-accent/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[16rem] text-[11px] leading-relaxed text-muted">
                提交即表示同意将上述信息发送给我，用于回复这条反馈。
              </p>
              <button
                type="submit"
                disabled={submitState.status === "sending"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#090b12] transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState.status === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitState.status === "sending" ? "发送中…" : "发送反馈"}
              </button>
            </div>

            <div aria-live="polite">
              {submitState.status === "success" && (
                <p className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-3 text-xs leading-relaxed text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  反馈已发送，我会通过邮件回复你。
                </p>
              )}
              {submitState.status === "error" && (
                <p className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3.5 py-3 text-xs leading-relaxed text-rose-200">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {submitState.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
