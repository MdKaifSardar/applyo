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
      className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="space-y-2">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          Poll Question
        </label>
        <input
          type="text"
          id="question"
          name="question"
          required
          placeholder="What's your favorite color?"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              name="options"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              required
              placeholder={`Option ${index + 1}`}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="px-3 py-2 text-gray-400 hover:text-red-500 transition-colors"
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
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
        >
          + Add Option
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-100"
      >
        Create Poll
      </button>
    </form>
  );
}
