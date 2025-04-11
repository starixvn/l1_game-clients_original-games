import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProviderSetDropDown from '../index';
import { usePreviewContext } from '../../../../previewProvider';
import { dataTheme } from '../index';
import { locales } from '../../../constants';

// Mock the PreviewContext
jest.mock('../../../../previewProvider', () => ({
    usePreviewContext: jest.fn(),
}));

const mockSetTheme = jest.fn();
const mockSetIsDarkMode = jest.fn();
const mockSetLanguage = jest.fn();

const mockContext = {
    theme: dataTheme.LIGHT01,
    setTheme: mockSetTheme,
    isDarkMode: false,
    setIsDarkMode: mockSetIsDarkMode,
    language: locales.vi,
    setLanguage: mockSetLanguage,
};

describe('ProviderSetDropDown', () => {
    beforeEach(() => {
        (usePreviewContext as jest.Mock).mockReturnValue(mockContext);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('changes theme and updates context accordingly', () => {
        render(<ProviderSetDropDown />);
        const themeSelect = screen.getByLabelText(/Select Theme/i);

        fireEvent.change(themeSelect, { target: { value: dataTheme.LIGHT02 } });

        expect(mockSetIsDarkMode).toHaveBeenCalledWith(false);
        expect(mockSetTheme).toHaveBeenCalledWith(dataTheme.LIGHT02);
    });

    it('sets dark mode correctly when DARK theme is selected', () => {
        render(<ProviderSetDropDown />);
        const themeSelect = screen.getByLabelText(/Select Theme/i);

        fireEvent.change(themeSelect, { target: { value: dataTheme.DARK } });

        expect(mockSetIsDarkMode).toHaveBeenCalledWith(true);
        expect(mockSetTheme).toHaveBeenCalledWith(dataTheme.DEFAULT);
    });

    it('changes language and updates context', () => {
        render(<ProviderSetDropDown />);
        const languageSelect = screen.getByLabelText(/Select Language/i);

        fireEvent.change(languageSelect, { target: { value: locales.vi } });

        expect(mockSetLanguage).toHaveBeenCalledWith(locales.vi);
    });
});
