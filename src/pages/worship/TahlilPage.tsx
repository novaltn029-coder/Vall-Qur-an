import React, { useState } from 'react';
import {
  ScrollText,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Share2,
  Check,
  CheckCircle2
} from 'lucide-react';
import { tahlilService, TAHLIL_SEQUENCE } from '../../services/tahlilService';
import { useApp } from '../../context/AppContext';

export const TahlilPage: React.FC = () => {
  const { showToast } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(26);
  const [copied, setCopied] = useState<boolean>(false);

  const steps = tahlilService.getSequence();
  const currentStep = steps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCounter(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setCounter(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleIncrementCounter = () => {
    if (counter < currentStep.repeatCount) {
      const nextVal = counter + 1;
      setCounter(nextVal);
      if (nextVal === currentStep.repeatCount && currentStep.repeatCount > 1) {
        showToast(`Target bacaan ${currentStep.repeatCount}x tercapai!`, 'success');
      }
    }
  };

  const handleCopy = async () => {
    const text = `${currentStep.title}\n\n${currentStep.arabic}\n\n"${currentStep.translation}"\n\nSusunan Tahlil Majmu' Syarif — val-qur'an`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Bacaan tahlil disalin ke clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Gagal menyalin teks.', 'error');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: currentStep.title,
      text: `${currentStep.title}\n\n${currentStep.arabic}\n\n"${currentStep.translation}"`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#031B4A]">
            Susunan Bacaan Tahlil Lengkap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Panduan tahlil &amp; doa arwah berdasarkan Kitab Majmu' Syarif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
              isFocusMode
                ? 'bg-[#000000] text-white border-black'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFocusMode ? 'Mode Daftar' : 'Mode Fokus'}</span>
          </button>

          {/* Font Controls */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setFontSize((s) => Math.max(20, s - 2))}
              className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Kecilkan teks Arab"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((s) => Math.min(42, s + 2))}
              className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Besarkan teks Arab"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar of Reading Sequence */}
      <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#031B4A]">
          <span>
            Urutan Bacaan ke-{currentStepIndex + 1} dari {steps.length}
          </span>
          <span className="text-[#1352B9]">{progressPercent}% Selesai</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1352B9] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mode Fokus (One Step View) vs Mode Daftar (All Steps View) */}
      {isFocusMode ? (
        /* Single Step Focus Card */
        <article className="p-6 sm:p-8 bg-white border-2 border-[#1352B9] rounded-3xl shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#031B4A] text-[#00A6FF] mb-2 inline-block">
                Langkah {currentStep.id}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#000000]">
                {currentStep.title}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                aria-label="Salin bacaan"
                className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-xl transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleShare}
                aria-label="Bagikan bacaan"
                className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Arabic Text */}
          <div className="py-2">
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-[#000000] text-right select-text leading-relaxed tracking-normal"
              style={{ fontSize: `${fontSize}px`, lineHeight: 2.3 }}
            >
              {currentStep.arabic}
            </p>
          </div>

          {/* Transliteration */}
          {currentStep.transliteration && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-[#1352B9] uppercase tracking-wide block mb-1">
                Transliterasi:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 italic font-sans leading-relaxed">
                {currentStep.transliteration}
              </p>
            </div>
          )}

          {/* Translation */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
              Terjemahan:
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-sans">
              "{currentStep.translation}"
            </p>
          </div>

          {/* Repetition Counter Widget (if repeatCount > 1) */}
          {currentStep.repeatCount > 1 && (
            <div className="p-4 bg-[#C2DFF3]/30 border border-[#1352B9] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#031B4A] block">
                  Penghitung Pengulangan Sunnah:
                </span>
                <span className="text-xs text-slate-500">
                  Target: <strong>{currentStep.repeatCount}x</strong> (Dikerjakan: {counter}x)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleIncrementCounter}
                  className="px-6 py-2.5 bg-[#000000] hover:bg-[#1352B9] text-white text-sm font-bold rounded-xl transition-colors shadow-xs active:scale-95"
                >
                  Hitung ({counter}/{currentStep.repeatCount})
                </button>
                <button
                  onClick={() => setCounter(0)}
                  aria-label="Reset hitungan"
                  className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              disabled={currentStepIndex <= 0}
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-[#031B4A] font-bold text-xs rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              disabled={currentStepIndex >= steps.length - 1}
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#000000] hover:bg-[#031B4A] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors"
            >
              <span>Lanjutkan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      ) : (
        /* Full Sequence List Mode */
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <article
              key={step.id}
              className="p-5 sm:p-6 bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-3xl shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-base font-bold text-[#000000]">{step.title}</h3>
                {step.repeatCount > 1 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C2DFF3] text-[#031B4A]">
                    {step.repeatCount}x Pengulangan
                  </span>
                )}
              </div>

              <p
                dir="rtl"
                lang="ar"
                className="font-arabic text-[#000000] text-right select-text leading-relaxed py-1"
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
              >
                {step.arabic}
              </p>

              {step.transliteration && (
                <p className="text-xs text-[#1352B9] italic font-sans leading-relaxed">
                  {step.transliteration}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                "{step.translation}"
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
