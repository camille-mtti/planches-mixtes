import React, { useState, useEffect } from 'react';
import { Card, Button, message, Typography } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { signInWithGoogle } from '../libs/firebase/auth';
import { onAuthStateChange } from '../libs/firebase/auth';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        window.location.href = '/';
      }
    });

    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Redirect will happen via useEffect
    } catch (error: any) {
      console.error('Sign in error:', error);
      message.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={2}>Planches Mixtes</Title>
          <Text type="secondary">Admin Panel</Text>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Text>
            Sign in to access the admin panel
          </Text>
        </div>

        <div style={{ marginTop: '32px' }}>
          <Button
            type="primary"
            size="large"
            icon={<GoogleOutlined />}
            onClick={handleGoogleSignIn}
            loading={loading}
            block
            style={{
              height: '50px',
              fontSize: '16px',
            }}
          >
            Sign in with Google
          </Button>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Only authorized administrators can access this panel
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

