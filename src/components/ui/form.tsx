'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

// Form Root
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);
Form.displayName = 'Form';

// Form Field
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

const FormField = ({ children, className }: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
};

// Form Label
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

// Form Control (wrapper for input)
interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

const FormControl = ({ children, className }: FormControlProps) => {
  return (
    <div className={cn('relative', className)}>
      {children}
    </div>
  );
};

// Form Message (for errors or help text)
interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'error' | 'help';
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, variant = 'error', ...props }, ref) => {
    if (!children) return null;
    
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm',
          variant === 'error' && 'text-destructive',
          variant === 'help' && 'text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = 'FormMessage';

// Form Description
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
};
