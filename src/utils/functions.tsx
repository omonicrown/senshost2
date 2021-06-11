
import React from 'react';
import { Route, RouteProps } from 'react-router';

import dayjs from "dayjs";

export function validateEmail(email: string): boolean {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function covertDateTimeField(date: Date | string): string {
  if (dayjs(date).isValid()) {
    return dayjs(date).format("DD - MMM h:mm A");
  }
  return date as string;
}

export function formatDateTime(date: Date | string, format?: string) {
  if(date) {
    return dayjs(date).format(format || "DD/MM/YYYY");
  }

  return date;
}

export function convertStringToJson<T>(strValue: string): T {
  try {
    return JSON.parse(strValue);
  } catch (err) {
    return [] as any;
  }
}

interface AppRouteProps extends RouteProps {
  component: any
  props?: any;
}

export const AppRoute = (props: AppRouteProps) => (
  <Route
    {...props}
    render={(renderProps) => {
      return (
        <props.component {...renderProps}{...props.props} />
      )
    }
    } />
);

export const validEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email) ? undefined : "invalid email";
}