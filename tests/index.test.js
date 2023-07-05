import Home from '../app/page.tsx'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

describe('Home', () => {
    it('renders home page', () => {
        render(<Home />)
        const linkElement = screen.getByText(/Get started by editing/i)
        expect(linkElement).toBeInTheDocument()
    })
})
