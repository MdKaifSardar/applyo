"use client";

import { useState } from "react";
import { createPoll } from "@/app/actions";

export function CreatePollForm() {
  const [options, setOptions] = useState(["", ""]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form
      action={createPoll}
      className="space-y-6 w-full max-w-5xl lg:max-w-none lg:w-[50vw] mx-auto p-8 bg-card text-card-foreground rounded-xl shadow-lg border border-border transition-colors duration-200"
    >
      <div className="space-y-2">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-foreground/80"
        >
          Poll Question
        </label>
        <input
          type="text"
          id="question"
          name="question"
          required
          placeholder="What's your favorite color?"
          className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground/80">
          Options
        </label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2 group">
            <input
              type="text"
              name="options"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              required
              placeholder={`Option ${index + 1}`}
              className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all text-foreground placeholder:text-muted-foreground"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                aria-label="Remove option"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-primary/5"
        >
          + Add Option
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-all focus:ring-4 focus:ring-primary/20 shadow-md active:scale-[0.99]"
      >
        Create Poll
      </button>
    </form>
  );
}
