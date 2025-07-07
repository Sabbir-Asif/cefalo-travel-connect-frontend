import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { LocationSuggestion } from '../../types/Location';
import { searchLocations } from '../../services/locationService';

interface LocationSearchProps {
    onLocationSelect: (location: { name: string; lat: number; long: number }) => void;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    error?: string;
    helperText?: string;
    required?: boolean;
    label?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
    onLocationSelect,
    placeholder = "Search for a location...",
    value = "",
    disabled = false,
    error,
    helperText,
    required = false,
    label = "Location"
}) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Use state instead of DOM modal
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update query when value prop changes
    useEffect(() => {
        setQuery(value);
    }, [value]);

    const searchDebounced = useCallback(async (searchQuery: string) => {
        if (searchQuery.length > 2) {
            setIsLoading(true);
            try {
                const results = await searchLocations(searchQuery);
                setSuggestions(results);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
            } catch (error) {
                console.error('Location search failed:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setHighlightedIndex(-1);
        }
    }, []);

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            searchDebounced(query);
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query, searchDebounced]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSuggestionSelect(suggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
        console.log('Suggestion selected:', suggestion); // Debug log
        setSelectedLocation(suggestion);
        setQuery(suggestion.display_name);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setShowConfirmModal(true); // Use state instead of DOM modal
    };

    const handleConfirmLocation = () => {
        if (selectedLocation) {
            console.log('Confirming location:', selectedLocation); // Debug log
            onLocationSelect({
                name: selectedLocation.display_name,
                lat: parseFloat(selectedLocation.lat),
                long: parseFloat(selectedLocation.lon)
            });
            setShowConfirmModal(false);
        }
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setSelectedLocation(null);
    };

    const clearInput = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedLocation(null);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    const getLocationIcon = (type: string) => {
        const iconMap: Record<string, string> = {
            city: '🏙️',
            town: '🏘️',
            village: '🏡',
            country: '🌍',
            state: '📍',
            default: '📍'
        };
        return iconMap[type.toLowerCase()] || iconMap.default;
    };

    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">
                        {label}
                        {required && <span className="text-error ml-1">*</span>}
                    </span>
                </label>
            )}
            
            <div className="relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        className={`input input-bordered w-full pr-20 ${
                            error ? 'input-error' : ''
                        } ${disabled ? 'input-disabled' : ''}`}
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        aria-expanded={showSuggestions}
                        aria-haspopup="listbox"
                        role="combobox"
                        aria-autocomplete="list"
                    />
                    
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        {isLoading && (
                            <span className="loading loading-spinner loading-sm"></span>
                        )}
                        {query && !disabled && (
                            <button
                                type="button"
                                onClick={clearInput}
                                className="btn btn-ghost btn-xs btn-circle"
                                tabIndex={-1}
                                aria-label="Clear input"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <svg className="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        role="listbox"
                    >
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={suggestion.place_id}
                                className={`px-4 py-3 cursor-pointer border-b border-base-300 last:border-b-0 transition-colors ${
                                    index === highlightedIndex 
                                        ? 'bg-primary/10 border-primary/20' 
                                        : 'hover:bg-base-200'
                                }`}
                                onClick={() => handleSuggestionSelect(suggestion)}
                                role="option"
                                aria-selected={index === highlightedIndex}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5 flex-shrink-0">
                                        {getLocationIcon(suggestion.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate text-sm">
                                            {suggestion.display_name}
                                        </div>
                                        <div className="text-xs text-base-content/60 mt-1 flex items-center gap-2">
                                            <span className="capitalize bg-base-200 px-2 py-0.5 rounded-full">
                                                {suggestion.type}
                                            </span>
                                            <span className="font-mono">
                                                {parseFloat(suggestion.lat).toFixed(4)}, {parseFloat(suggestion.lon).toFixed(4)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showSuggestions && suggestions.length === 0 && query.length > 2 && !isLoading && (
                    <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 text-center text-base-content/60">
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No locations found for "{query}"</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                )}
            </div>
            
            {(error || helperText) && (
                <label className="label">
                    <span className={`label-text-alt ${error ? 'text-error' : 'text-base-content/60'}`}>
                        {error || helperText}
                    </span>
                </label>
            )}
            
            {/* Use conditional rendering instead of DOM modal */}
            {showConfirmModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Confirm Location
                        </h3>
                        
                        {selectedLocation && (
                            <div className="space-y-4">
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">
                                            {getLocationIcon(selectedLocation.type)}
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-base mb-1">
                                                {selectedLocation.display_name}
                                            </h4>
                                            <div className="space-y-2 text-sm text-base-content/70">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Type:</span>
                                                    <span className="badge badge-outline badge-sm capitalize">
                                                        {selectedLocation.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Coordinates:</span>
                                                    <span className="font-mono text-xs bg-base-300 px-2 py-1 rounded">
                                                        {parseFloat(selectedLocation.lat).toFixed(6)}, {parseFloat(selectedLocation.lon).toFixed(6)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="modal-action">
                            <div className="flex gap-2">
                                <button className="btn btn-ghost" onClick={handleCancelConfirm}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleConfirmLocation}
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirm Location
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={handleCancelConfirm}></div>
                </div>
            )}
        </div>
    );
};