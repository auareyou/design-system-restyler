"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.icon}>!</div>
          <div className={styles.title}>Something went wrong</div>
          <div className={styles.message}>
            {this.props.fallbackMessage ||
              this.state.error?.message ||
              "An unexpected error occurred"}
          </div>
          <button className={styles.retryButton} onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
