import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from "react-dom";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    onEnter?: () => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder, onEnter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                dropdownRef.current?.contains(target) ||
                menuRef.current?.contains(target)
            ) {
                return;
            }
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openMenu = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 6,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
        setIsOpen(true);
    };

    return (
        <div className="relative min-w-[200px]" ref={dropdownRef}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => {
                    if (!isOpen) {
                        openMenu();
                    } else {
                        setIsOpen(false);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (!isOpen) {
                            e.preventDefault();
                            if (onEnter) onEnter(); // Execute save when closed
                        } else {
                            setIsOpen(false);
                        }
                    } else if (e.key === 'ArrowDown' || e.key === ' ') {
                        e.preventDefault();
                        if (!isOpen) openMenu();
                    } else if (e.key === 'Escape') {
                        setIsOpen(false);
                    }
                }}
                className="w-full h-8 flex items-center justify-between rounded border border-sky-300 bg-sky-50 px-2 text-sm text-sky-800 outline-none hover:border-sky-400 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-400 transition-all font-medium cursor-pointer box-border"
            >
                <span className={value ? 'text-sky-900 font-medium' : 'text-sky-400 italic'}>
                    {value || placeholder}
                </span>
                <span className={`material-symbols-outlined text-[16px] text-sky-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            position: "fixed",
                            top: position.top,
                            left: position.left,
                            width: position.width,
                            zIndex: 9999,
                        }}
                        className="max-h-40 overflow-y-auto rounded-xl border border-sky-100 bg-white p-1 shadow-lg ring-1 ring-sky-900/5"
                    >
                        <button
                            type="button"
                            onClick={() => { onChange(''); setIsOpen(false); buttonRef.current?.focus(); }}
                            className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${!value ? 'bg-sky-50 text-sky-900' : 'text-sky-400 hover:bg-sky-50/60 hover:text-sky-800'}`}
                        >
                            {placeholder}
                        </button>
                        <div className="pt-1 mt-1 space-y-0.5">
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => { onChange(opt); setIsOpen(false); buttonRef.current?.focus(); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${value === opt ? 'bg-sky-600 text-white font-medium shadow-2xs' : 'text-sky-800 hover:bg-sky-50/80 hover:text-sky-950'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};