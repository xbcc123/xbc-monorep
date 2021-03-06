import React from 'react';
import { Button } from './Button';
import { XButton } from "xbc-design/src"
// import "xbc-design/es/styles/index.css"

export default {
  title: 'Example/XButton',
  component: XButton,
};

const Template = (args) => <XButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  size: '555555555555',
};

