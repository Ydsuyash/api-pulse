import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MonitorCard from './MonitorCard';
import { describe, it, expect, vi } from 'vitest';

const mockMonitor = {
    id: '1',
    name: 'Test Monitor',
    url: 'http://example.com',
    status: 'UP' as const,
    isActive: true,
    lastChecked: 'Just now',
    latency: 120,
};

describe('MonitorCard', () => {
    it('renders monitor details correctly', () => {
        const onEdit = vi.fn();
        const onDelete = vi.fn();
        render(
            <BrowserRouter>
                <MonitorCard monitor={mockMonitor} onEdit={onEdit} onDelete={onDelete} />
            </BrowserRouter>
        );

        expect(screen.getByText('Test Monitor')).toBeInTheDocument();
        expect(screen.getByText('http://example.com')).toBeInTheDocument();
        expect(screen.getByText('UP')).toBeInTheDocument();
        expect(screen.getByText('120ms')).toBeInTheDocument();
    });

    it('renders UP status with correct styling', () => {
        const onEdit = vi.fn();
        const onDelete = vi.fn();
        render(
            <BrowserRouter>
                <MonitorCard monitor={mockMonitor} onEdit={onEdit} onDelete={onDelete} />
            </BrowserRouter>
        );

        const statusText = screen.getByText('UP');
        const statusBadge = statusText.closest('span.px-3'); // Find the badge container
        expect(statusBadge).toHaveClass('text-green-400');
    });

    it('calls onEdit when edit button is clicked', () => {
        const onEdit = vi.fn();
        const onDelete = vi.fn();
        render(
            <BrowserRouter>
                <MonitorCard monitor={mockMonitor} onEdit={onEdit} onDelete={onDelete} />
            </BrowserRouter>
        );

        const editButton = screen.getByTitle('Edit Monitor');
        fireEvent.click(editButton);

        expect(onEdit).toHaveBeenCalledWith(mockMonitor);
    });
});
