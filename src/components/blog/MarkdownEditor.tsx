import React, { useState, useCallback, useMemo } from 'react';
import MDEditor, { commands, type ICommand } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
    label?: string;
    showWordCount?: boolean;
    showCharCount?: boolean;
    maxLength?: number;
    disabled?: boolean;
    error?: string;
    helperText?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder = "Write your blog description in markdown...",
    height = 400,
    label = "Description",
    showWordCount = true,
    showCharCount = false,
    maxLength,
    disabled = false,
    error,
    helperText
}) => {
    const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
    const customCommands = useMemo(() => {
        const highlightCommand: ICommand = {
            name: 'highlight',
            keyCommand: 'highlight',
            buttonProps: { 'aria-label': 'Add highlight text', title: 'Add highlight text' },
            icon: (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="12" rx="1" ry="1" strokeWidth="2" />
                    <path d="M7 8h10M7 12h10" strokeWidth="2" />
                </svg>
            ),
            execute: (state, api) => {
                const modifyText = `==highlighted text==`;
                if (!state.selectedText) {
                    api.replaceSelection(modifyText);
                } else {
                    api.replaceSelection(`==${state.selectedText}==`);
                }
            },
        };

        return [
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            commands.divider,
            commands.title,
            commands.title2,
            commands.title3,
            commands.title4,
            commands.title5,
            commands.title6,
            commands.divider,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
            commands.divider,
            commands.link,
            commands.quote,
            commands.code,
            commands.codeBlock,
            commands.image,
            commands.divider,
            highlightCommand,
            commands.divider,
            commands.table,
            commands.fullscreen,
        ];
    }, []);

    const stats = useMemo(() => {
        const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
        const charCount = value.length;
        const charCountNoSpaces = value.replace(/\s/g, '').length;
        const lineCount = value.split('\n').length;

        return {
            words: wordCount,
            characters: charCount,
            charactersNoSpaces: charCountNoSpaces,
            lines: lineCount,
        };
    }, [value]);

    const handleChange = useCallback((val?: string) => {
        const newValue = val || '';
        if (maxLength && newValue.length > maxLength) {
            return;
        }
        onChange(newValue);
    }, [onChange, maxLength]);

    const getPreviewMode = () => {
        switch (mode) {
            case 'preview':
                return 'preview';
            case 'edit':
                return 'edit';
            case 'split':
                return 'live';
            default:
                return 'edit';
        }
    };

    return (
        <div className="w-full">

            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <label className="label-text font-semibold text-base-content">
                        {label}
                    </label>
                    {maxLength && (
                        <span className="badge badge-outline badge-sm">
                            {stats.characters}/{maxLength}
                        </span>
                    )}
                </div>

                <div className="tabs tabs-boxed tabs-sm">
                    <button
                        type="button"
                        className={`tab tab-sm ${mode === 'edit' ? 'tab-active' : ''}`}
                        onClick={() => setMode('edit')}
                        disabled={disabled}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        type="button"
                        className={`tab tab-sm ${mode === 'split' ? 'tab-active' : ''}`}
                        onClick={() => setMode('split')}
                        disabled={disabled}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Split
                    </button>
                    <button
                        type="button"
                        className={`tab tab-sm ${mode === 'preview' ? 'tab-active' : ''}`}
                        onClick={() => setMode('preview')}
                        disabled={disabled}
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                    </button>
                </div>
            </div>

            <div className={`border rounded-lg overflow-hidden transition-all duration-200 ${error
                    ? 'border-error shadow-sm'
                    : 'border-base-300 hover:border-base-400 focus-within:border-primary focus-within:shadow-sm'
                } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
                <MDEditor
                    value={value}
                    onChange={handleChange}
                    preview={getPreviewMode()}
                    hideToolbar={false}
                    height={height}
                    data-color-mode="light"
                    commands={customCommands}
                    textareaProps={{
                        placeholder,
                        disabled,
                        style: {
                            fontSize: 14,
                            lineHeight: 1.6,
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            backgroundColor: disabled ? '#f3f4f6' : 'transparent',
                        }
                    }}
                    className={disabled ? 'opacity-60' : ''}
                />
            </div>

            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-4 text-xs text-base-content/60">
                    {showWordCount && (
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {stats.words} words
                        </span>
                    )}
                    {showCharCount && (
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            {stats.characters} chars
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        {stats.lines} lines
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Help
                        </label>
                        <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-80 p-4 shadow-lg bg-base-100 border border-base-300">
                            <div className="card-body">
                                <h3 className="font-semibold text-sm mb-2">Markdown Quick Reference</h3>
                                <div className="text-xs space-y-1 text-base-content/70">
                                    <div><code>**bold**</code> → <strong>bold text</strong></div>
                                    <div><code>*italic*</code> → <em>italic text</em></div>
                                    <div><code>`code`</code> → <code>inline code</code></div>
                                    <div><code># Heading</code> → Large heading</div>
                                    <div><code>- List item</code> → Bullet point</div>
                                    <div><code>[Link](url)</code> → Clickable link</div>
                                    <div><code>==highlight==</code> → Highlighted text</div>
                                    <div><code>- [x] Task</code> → Completed task</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => onChange('')}
                        disabled={disabled || !value}
                        title="Clear content"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error mt-2 py-2">
                    <svg className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {helperText && !error && (
                <div className="text-xs text-base-content/60 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {helperText}
                </div>
            )}
        </div>
    );
};