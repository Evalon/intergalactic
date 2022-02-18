import React from 'react';
import { testing } from '@semcore/jest-preset-ui';
const { cleanup, render } = testing;
import { shared as testsShared } from '@semcore/jest-preset-ui';
const { shouldSupportClassName, shouldSupportRef } = testsShared;
import { snapshot } from '@semcore/jest-preset-ui';
import SpinContainer from '../src';

describe('SpinContainer', () => {
  afterEach(cleanup);

  shouldSupportClassName(SpinContainer);
  shouldSupportRef(SpinContainer);

  test('Should support custom attributes', () => {
    const { getByTestId } = render(<SpinContainer data-testid="spin" name="spinner" />);
    expect(getByTestId('spin').attributes['name'].value).toEqual('spinner');
  });

  test('Should support children', () => {
    const { getByTestId } = render(
      <SpinContainer data-testid="spin" loading>
        <p>Hello there</p>
      </SpinContainer>,
    );
    expect(getByTestId('spin').querySelectorAll('p')).toHaveLength(1);
  });

  test('Should render spinner correctly', async () => {
    const Component = (
      <SpinContainer loading>
        <p>Hello there</p>
      </SpinContainer>
    );
    expect(await snapshot(Component)).toMatchImageSnapshot();
  });

  test('Should support custom background', async () => {
    const Component = (
      <SpinContainer size="xxs" theme="invert" background="gray60" loading>
        <p>Hello there</p>
      </SpinContainer>
    );
    expect(await snapshot(Component)).toMatchImageSnapshot();
  });
});
