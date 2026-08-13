import { Plus, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Ingredient = { amount: string; unit: string; name: string };
type FormErrors = Record<string, string>;

export default function NewRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ amount: '', unit: '', name: '' }]);
  const [steps, setSteps] = useState(['']);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const updateIngredient = (index: number, key: keyof Ingredient, value: string) => setIngredients(items => items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSuccess(false);
    const form = new FormData(event.currentTarget); const next: FormErrors = {};
    const title = String(form.get('title') || '').trim(); const category = String(form.get('category') || '').trim();
    const time = Number(form.get('preparationTime')); const servings = Number(form.get('servings'));
    if (!title) next.title = 'Bitte gib einen Titel ein.';
    if (!category) next.category = 'Bitte gib eine Kategorie ein.';
    if (!Number.isFinite(time) || time <= 0) next.preparationTime = 'Bitte gib eine positive Minutenzahl ein.';
    if (!Number.isInteger(servings) || servings <= 0) next.servings = 'Bitte gib eine positive ganze Zahl ein.';
    ingredients.forEach((item, i) => { if (!item.name.trim()) next[`ingredient-${i}`] = 'Bitte gib eine Bezeichnung ein.'; });
    steps.forEach((step, i) => { if (!step.trim()) next[`step-${i}`] = 'Bitte beschreibe diesen Schritt.'; });
    setErrors(next); if (Object.keys(next).length) return;
    console.log('Neues Rezept:', { title, category, preparationTime: time, servings, ingredients, steps }); setSuccess(true);
  };
  return <section className="section page form-page"><span className="eyebrow">DEIN REZEPT</span><h1>Neues Rezept</h1><p className="intro">Halte deine Lieblingsrezepte fest.</p><form onSubmit={submit} noValidate><div className="form-card"><h2>Grundinformationen</h2><div className="form-grid"><Field label="Titel" name="title" error={errors.title} required/><Field label="Kategorie" name="category" error={errors.category} required/><Field label="Zubereitungszeit (Minuten)" name="preparationTime" type="number" min="1" error={errors.preparationTime} required/><Field label="Portionen" name="servings" type="number" min="1" step="1" error={errors.servings} required/></div></div><div className="form-card"><div className="form-heading"><h2>Zutaten</h2><button type="button" className="small-button" onClick={() => setIngredients(items => [...items, { amount: '', unit: '', name: '' }])}><Plus size={16}/> Zutat hinzufügen</button></div>{ingredients.map((item, index) => <div className="dynamic-row" key={index}><input aria-label="Menge" value={item.amount} onChange={e => updateIngredient(index, 'amount', e.target.value)} placeholder="Menge"/><input aria-label="Einheit" value={item.unit} onChange={e => updateIngredient(index, 'unit', e.target.value)} placeholder="Einheit"/><div className="wide-input"><input aria-label="Bezeichnung" required value={item.name} onChange={e => updateIngredient(index, 'name', e.target.value)} placeholder="Bezeichnung"/>{errors[`ingredient-${index}`] && <small className="error">{errors[`ingredient-${index}`]}</small>}</div><button type="button" className="icon-button" disabled={ingredients.length === 1} onClick={() => setIngredients(items => items.filter((_, i) => i !== index))} aria-label="Zutat entfernen"><Trash2 size={17}/></button></div>)}</div><div className="form-card"><div className="form-heading"><h2>Zubereitungsschritte</h2><button type="button" className="small-button" onClick={() => setSteps(items => [...items, ''])}><Plus size={16}/> Schritt hinzufügen</button></div>{steps.map((step, index) => <div className="step-row" key={index}><span>{index + 1}</span><div className="wide-input"><textarea aria-label={`Zubereitungsschritt ${index + 1}`} required rows={3} value={step} onChange={e => setSteps(items => items.map((v, i) => i === index ? e.target.value : v))} placeholder="Beschreibe diesen Schritt ..."/>{errors[`step-${index}`] && <small className="error">{errors[`step-${index}`]}</small>}</div><button type="button" className="icon-button" disabled={steps.length === 1} onClick={() => setSteps(items => items.filter((_, i) => i !== index))} aria-label="Schritt entfernen"><Trash2 size={17}/></button></div>)}</div>{success && <p className="success">Rezept erfolgreich validiert und in der Browser-Konsole ausgegeben.</p>}<div className="form-actions"><button type="submit" className="button">Rezept speichern</button></div></form></section>;
}
function Field({ label, name, error, type = 'text', min, step, required }: { label: string; name: string; error?: string; type?: string; min?: string; step?: string; required?: boolean }) { return <label>{label}<input name={name} type={type} min={min} step={step} required={required} aria-invalid={Boolean(error)}/>{error && <small className="error">{error}</small>}</label>; }
