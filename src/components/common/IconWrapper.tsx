interface IconWrapperProps {
  Icon: any;
  className?: string;
  [key: string]: any;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ Icon, ...props }) => {
  return <Icon {...props} />;
};

export default IconWrapper;