import { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { col, alpha } from '../lib/theme'
import type { FrequentAnswer } from '../types'

function AnswerCard({
  answer,
  onDelete,
  onSave
}: {
  answer: FrequentAnswer
  onDelete: () => void
  onSave: (updated: FrequentAnswer) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    question: answer.question,
    answer: answer.answer,
    tagsStr: answer.tags.join(', ')
  })

  const save = () => {
    onSave({
      ...answer,
      question: form.question.trim(),
      answer: form.answer.trim(),
      tags: form.tagsStr.split(',').map((t) => t.trim()).filter(Boolean)
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div
        className="card flex flex-col gap-2.5 animate-fade-in"
        style={{ borderColor: alpha(col.cream, 0.35) }}
      >
        <input
          className="input" value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="Pregunta" autoFocus
        />
        <textarea
          className="input" rows={3} value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          placeholder="Respuesta"
        />
        <input
          className="input" value={form.tagsStr}
          onChange={(e) => setForm((f) => ({ ...f, tagsStr: e.target.value }))}
          placeholder="Tags (separados por coma)"
        />
        <div className="flex gap-2">
          <button className="btn-primary" onClick={save}><Check size={12} /> Guardar</button>
          <button className="btn-secondary" onClick={() => setEditing(false)}><X size={12} /> Cancelar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-snug" style={{ color: col.fg }}>{answer.question}</p>
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: col.fgDim }}>{answer.answer}</p>
          {answer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {answer.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-0.5 flex-shrink-0">
          <button
            className="btn-mini"
            onClick={() => setEditing(true)}
            title="Editar"
          >
            <Edit2 size={12} />
          </button>
          <button
            className="btn-mini"
            onClick={onDelete}
            style={{ color: col.red, borderColor: 'transparent' }}
            title="Eliminar"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

function NewAnswerForm({ onSave }: { onSave: (a: FrequentAnswer) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ question: '', answer: '', tagsStr: '' })

  const save = () => {
    if (!form.question.trim() || !form.answer.trim()) return
    onSave({
      id: `ans-${Date.now()}`,
      question: form.question.trim(),
      answer: form.answer.trim(),
      tags: form.tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    })
    setForm({ question: '', answer: '', tagsStr: '' })
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed text-2xs transition-colors"
        style={{
          background: 'transparent',
          borderColor: alpha(col.border, 0.35),
          color: col.fgMuted,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = alpha(col.cream, 0.4)
          e.currentTarget.style.color = col.cream
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = alpha(col.border, 0.35)
          e.currentTarget.style.color = col.fgMuted
        }}
        onClick={() => setOpen(true)}
      >
        <Plus size={13} /> Agregar respuesta frecuente
      </button>
    )
  }

  return (
    <div className="card flex flex-col gap-2.5 animate-fade-in" style={{ borderColor: alpha(col.cream, 0.3) }}>
      <input
        className="input" value={form.question}
        onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
        placeholder="¿Cuál es tu pretensión salarial?"
        autoFocus
      />
      <textarea
        className="input" rows={3} value={form.answer}
        onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
        placeholder="Tu respuesta..."
      />
      <input
        className="input" value={form.tagsStr}
        onChange={(e) => setForm((f) => ({ ...f, tagsStr: e.target.value }))}
        placeholder="Tags: salario, experiencia, modalidad"
      />
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save}><Plus size={12} /> Agregar</button>
        <button className="btn-secondary" onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </div>
  )
}

export function Answers() {
  const answers    = useStore((s) => s.answers)
  const setAnswers = useStore((s) => s.setAnswers)

  const save   = (updated: FrequentAnswer) => setAnswers(answers.map((a) => (a.id === updated.id ? updated : a)))
  const remove = (id: string)              => setAnswers(answers.filter((a) => a.id !== id))
  const add    = (a: FrequentAnswer)       => setAnswers([...answers, a])

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="font-bold" style={{ color: col.cream, fontSize: '0.9375rem' }}>Banco de respuestas</h1>
        <p className="text-2xs mt-0.5" style={{ color: col.fgMuted }}>
          {answers.length} respuestas · Cowork las usa al completar formularios de postulación
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <NewAnswerForm onSave={add} />
        {answers.length === 0 ? (
          <div className="card text-center py-6">
            <p className="text-2xs" style={{ color: col.fgMuted }}>
              No hay respuestas todavía. Agregá preguntas frecuentes para que Cowork las use al postular.
            </p>
          </div>
        ) : (
          answers.map((a) => (
            <AnswerCard key={a.id} answer={a} onDelete={() => remove(a.id)} onSave={save} />
          ))
        )}
      </div>
    </div>
  )
}
