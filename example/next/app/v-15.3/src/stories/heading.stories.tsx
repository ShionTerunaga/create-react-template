import { Heading } from "@/components/ui";
import type { Meta, StoryObj } from "@storybook/nextjs";

//
//import { Page } from './Page';
//
const meta = {
    title: "ui/heading",
    component: Heading,
    parameters: {
        layout: "fullscreen"
    }
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        as: "h1",
        fontStyle: "firstBig",
        color: "textNormal",
        children: <>hello</>
    }
};
//
//// More on component testing: https://storybook.js.org/docs/writing-tests/interaction-testing
//export const LoggedIn: Story = {
//  play: async ({ canvasElement }) => {
//    const canvas = within(canvasElement);
//    const loginButton = canvas.getByRole('button', { name: /Log in/i });
//    await expect(loginButton).toBeInTheDocument();
//    await userEvent.click(loginButton);
//    await expect(loginButton).not.toBeInTheDocument();
//
//    const logoutButton = canvas.getByRole('button', { name: /Log out/i });
//    await expect(logoutButton).toBeInTheDocument();
//  },
//};
