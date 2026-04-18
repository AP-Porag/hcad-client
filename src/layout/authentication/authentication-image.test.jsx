import { render } from '@/test-utils';
import { axe } from 'jest-axe';
import attributes from './attributes.json';
import { AuthenticationImage } from './AuthenticationImage';

describe('AuthenticationImage', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <AuthenticationImage {...attributes} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders correctly', () => {
    render(<AuthenticationImage {...attributes} />);
  });
});