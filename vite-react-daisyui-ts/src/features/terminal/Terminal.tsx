import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exit_code: number | null;
}

export function Terminal() {
  const [command, setCommand] = useState('');
  const [shellType, setShellType] = useState<'cmd' | 'powershell'>('cmd');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([]);

  const executeCommand = async () => {
    if (!command.trim()) return;

    setIsLoading(true);
    setOutput('Executing...');

    try {
      let result: CommandResult;

      if (shellType === 'cmd') {
        // Split command and args for CMD
        const parts = command.trim().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        result = await invoke<CommandResult>('execute_cmd_command', {
          command: cmd,
          args: args,
        });
      } else {
        // PowerShell command as single string
        result = await invoke<CommandResult>('execute_powershell_command', {
          command: command.trim(),
        });
      }

      const outputText = `
Exit Code: ${result.exit_code}
Status: ${result.success ? '✓ Success' : '✗ Failed'}

--- STDOUT ---
${result.stdout || '(empty)'}

--- STDERR ---
${result.stderr || '(empty)'}
      `.trim();

      setOutput(outputText);
      setHistory(prev => [...prev, { command, output: outputText }]);
    } catch (error) {
      const errorMsg = `Error: ${error}`;
      setOutput(errorMsg);
      setHistory(prev => [...prev, { command, output: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemInfo = async () => {
    setIsLoading(true);
    try {
      const info = await invoke<string>('get_system_info');
      setOutput(info);
      setHistory(prev => [...prev, { command: 'get_system_info', output: info }]);
    } catch (error) {
      const errorMsg = `Error: ${error}`;
      setOutput(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setOutput('');
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            🖥️ Desktop Terminal
          </h2>

          {/* Shell Type Selector */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Shell Type</span>
            </label>
            <div className="flex gap-4">
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="shell"
                  className="radio radio-primary"
                  checked={shellType === 'cmd'}
                  onChange={() => setShellType('cmd')}
                />
                <span className="label-text">CMD</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="shell"
                  className="radio radio-primary"
                  checked={shellType === 'powershell'}
                  onChange={() => setShellType('powershell')}
                />
                <span className="label-text">PowerShell</span>
              </label>
            </div>
          </div>

          {/* Command Input */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold">Command</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={shellType === 'cmd' ? 'e.g., dir' : 'e.g., Get-Process | Select-Object -First 5'}
                className="input input-bordered flex-1"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
                disabled={isLoading}
              />
              <button
                className="btn btn-primary"
                onClick={executeCommand}
                disabled={isLoading || !command.trim()}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Execute'
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mb-4">
            <button className="btn btn-sm btn-outline" onClick={getSystemInfo} disabled={isLoading}>
              System Info
            </button>
            <button className="btn btn-sm btn-outline" onClick={clearHistory}>
              Clear History
            </button>
          </div>

          {/* Output */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Output</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-64 font-mono text-sm"
              value={output}
              readOnly
              placeholder="Command output will appear here..."
            />
          </div>

          {/* Command History */}
          {history.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Command History</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.slice().reverse().map((item, index) => (
                  <div key={index} className="collapse collapse-arrow bg-base-100">
                    <input type="checkbox" />
                    <div className="collapse-title font-mono text-sm">
                      <span className="badge badge-primary badge-sm mr-2">
                        {history.length - index}
                      </span>
                      {item.command}
                    </div>
                    <div className="collapse-content">
                      <pre className="text-xs whitespace-pre-wrap">{item.output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="alert alert-warning mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>Security Warning:</strong> Be careful when executing commands. 
              Only run commands you understand and trust.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
