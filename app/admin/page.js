'use client';

import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';

// ── MUI theme aligned with DESIGN.md palette ────────────────────────────────
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#201d1d', paper: '#302c2c' },
    text: { primary: '#fdfcfc', secondary: '#9a9898' },
    error: { main: '#ff3b30' },
    warning: { main: '#ff9f0a' },
    success: { main: '#30d158' },
    primary: { main: '#007aff' },
    divider: '#646262',
  },
  typography: {
    fontFamily:
      "'Berkeley Mono', 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
    fontSize: 13,
  },
  shape: { borderRadius: 4 },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#646262', fontSize: '13px' },
        head: { backgroundColor: '#201d1d', color: '#9a9898', fontWeight: 700, letterSpacing: '0.08em' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: 'inherit', fontSize: '11px', height: '20px', borderRadius: '4px' },
      },
    },
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseList(jsonStr) {
  try { return JSON.parse(jsonStr ?? '[]'); } catch { return []; }
}

function ThreatLevelChip({ level }) {
  const map = {
    safe:    { label: 'SAFE',    color: 'success' },
    warning: { label: 'WARNING', color: 'warning' },
    danger:  { label: 'DANGER',  color: 'error' },
  };
  const cfg = map[level] ?? { label: level?.toUpperCase() ?? '?', color: 'default' };
  return <Chip label={cfg.label} color={cfg.color} size="small" variant="outlined" />;
}

// ── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onLogin, error, loading }) {
  const [pw, setPw] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (pw.trim()) onLogin(pw.trim());
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#201d1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Berkeley Mono','IBM Plex Mono',ui-monospace,monospace",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          backgroundColor: '#302c2c',
          border: '1px solid #646262',
          borderRadius: '4px',
        }}
      >
        {/* Terminal chrome */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff3b30', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff9f0a', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#30d158', display: 'inline-block' }} />
        </div>

        <p style={{ color: '#007aff', fontSize: '13px', marginBottom: '8px' }}>
          $ admin --authenticate
        </p>
        <h1 style={{ color: '#fdfcfc', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6e6e73', fontSize: '13px', marginBottom: '32px' }}>
          Enter your admin secret to view stored threat intelligence.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="admin secret"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#201d1d',
              color: '#fdfcfc',
              border: `1px solid ${error ? '#ff3b30' : '#646262'}`,
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <p style={{ color: '#ff3b30', fontSize: '13px', marginBottom: '12px' }}>
              ✕ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pw.trim()}
            style={{
              width: '100%',
              padding: '10px 20px',
              backgroundColor: pw.trim() && !loading ? '#fdfcfc' : '#302c2c',
              color: pw.trim() && !loading ? '#201d1d' : '#6e6e73',
              border: `1px solid ${pw.trim() && !loading ? '#fdfcfc' : '#646262'}`,
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '14px',
              fontWeight: 700,
              cursor: pw.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'background-color 100ms, color 100ms',
            }}
          >
            {loading ? '[ authenticating... ]' : '[ access dashboard ]'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Threat Table ─────────────────────────────────────────────────────────────

function ThreatTable({ threats, onLogout }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ minHeight: '100vh', backgroundColor: '#201d1d', padding: '0' }}>
        {/* Header */}
        <nav
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(15,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#201d1d',
            fontFamily: "'Berkeley Mono','IBM Plex Mono',ui-monospace,monospace",
          }}
        >
          <div>
            <span style={{ color: '#fdfcfc', fontWeight: 700, fontSize: '15px' }}>
              skill<span style={{ color: '#6e6e73' }}>.</span>checker
            </span>
            <span
              style={{
                marginLeft: '12px',
                color: '#ff9f0a',
                fontSize: '11px',
                border: '1px solid rgba(255,159,10,0.35)',
                borderRadius: '4px',
                padding: '2px 8px',
                letterSpacing: '0.06em',
              }}
            >
              ADMIN
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#6e6e73', fontSize: '13px' }}>
              {threats.length} records
            </span>
            <button
              onClick={onLogout}
              style={{
                background: 'none',
                border: '1px solid #646262',
                borderRadius: '4px',
                color: '#9a9898',
                fontFamily: 'inherit',
                fontSize: '13px',
                padding: '4px 14px',
                cursor: 'pointer',
              }}
            >
              logout
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <p
            style={{
              color: '#9a9898',
              fontSize: '12px',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginBottom: '16px',
              fontFamily: "'Berkeley Mono','IBM Plex Mono',ui-monospace,monospace",
            }}
          >
            STORED THREAT INTELLIGENCE — TOP 50 MATCHES
          </p>

          {threats.length === 0 ? (
            <p style={{
              color: '#6e6e73',
              fontSize: '14px',
              fontFamily: "'Berkeley Mono','IBM Plex Mono',ui-monospace,monospace",
            }}>
              No threats stored in vector database yet. Analyze some skills to populate the index.
            </p>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ border: '1px solid #646262', boxShadow: 'none' }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '180px' }}>ID</TableCell>
                    <TableCell sx={{ width: '80px' }}>LEVEL</TableCell>
                    <TableCell>SUMMARY</TableCell>
                    <TableCell sx={{ width: '260px' }}>FLAGGED HARMS</TableCell>
                    <TableCell sx={{ width: '80px', textAlign: 'right' }}>SCORE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {threats.map((t) => {
                    const harms = parseList(t.metadata?.potential_harms);
                    return (
                      <TableRow
                        key={t.id}
                        hover
                        sx={{ '&:last-child td': { border: 0 } }}
                      >
                        {/* ID */}
                        <TableCell
                          sx={{ fontFamily: 'inherit', color: '#6e6e73', fontSize: '11px' }}
                          title={t.id}
                        >
                          {t.id?.slice(0, 8)}…
                        </TableCell>

                        {/* Threat level */}
                        <TableCell>
                          <ThreatLevelChip level={t.metadata?.threat_level} />
                        </TableCell>

                        {/* Summary */}
                        <TableCell sx={{ color: '#fdfcfc', lineHeight: 1.5 }}>
                          {t.metadata?.summary ?? '—'}
                        </TableCell>

                        {/* Flagged harms */}
                        <TableCell>
                          {harms.length > 0 ? (
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                              {harms.slice(0, 3).map((h, i) => (
                                <li
                                  key={i}
                                  style={{
                                    color: '#ff9f0a',
                                    fontSize: '12px',
                                    lineHeight: 1.6,
                                    paddingLeft: '10px',
                                    position: 'relative',
                                  }}
                                >
                                  <span style={{ position: 'absolute', left: 0, color: '#646262' }}>›</span>
                                  {h}
                                </li>
                              ))}
                              {harms.length > 3 && (
                                <li style={{ color: '#6e6e73', fontSize: '11px' }}>
                                  +{harms.length - 3} more
                                </li>
                              )}
                            </ul>
                          ) : (
                            <span style={{ color: '#30d158', fontSize: '12px' }}>none detected</span>
                          )}
                        </TableCell>

                        {/* Similarity score */}
                        <TableCell sx={{ textAlign: 'right', color: '#6e6e73', fontSize: '12px' }}>
                          {t.score != null ? t.score.toFixed(4) : '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [threats, setThreats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(password) {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/threats', {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.status === 401) {
        setError('Invalid admin secret. Access denied.');
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `server error (${res.status})`);
        return;
      }

      const data = await res.json();
      setThreats(data.threats ?? []);
    } catch (err) {
      setError(err?.message ?? 'Network error — check your connection.');
    } finally {
      setLoading(false);
    }
  }

  if (threats !== null) {
    return <ThreatTable threats={threats} onLogout={() => setThreats(null)} />;
  }

  return <LoginForm onLogin={handleLogin} error={error} loading={loading} />;
}
