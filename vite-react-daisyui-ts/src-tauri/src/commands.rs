use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandResult {
    pub success: bool,
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
}

/// Execute a CMD command with arguments
/// 
/// # Security
/// This function should be used with caution. Consider implementing
/// a whitelist of allowed commands in production.
#[tauri::command]
pub fn execute_cmd_command(command: String, args: Vec<String>) -> Result<CommandResult, String> {
    // Execute command using cmd.exe on Windows
    let output = if cfg!(target_os = "windows") {
        let mut cmd_args = vec!["/C".to_string(), command.clone()];
        cmd_args.extend(args);
        
        Command::new("cmd")
            .args(&cmd_args)
            .output()
    } else {
        // For non-Windows systems, use sh
        let full_command = format!("{} {}", command, args.join(" "));
        Command::new("sh")
            .arg("-c")
            .arg(&full_command)
            .output()
    };

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).to_string();
            let exit_code = output.status.code();
            let success = output.status.success();

            Ok(CommandResult {
                success,
                stdout,
                stderr,
                exit_code,
            })
        }
        Err(e) => Err(format!("Failed to execute command: {}", e)),
    }
}

/// Execute a PowerShell command
#[tauri::command]
pub fn execute_powershell_command(command: String) -> Result<CommandResult, String> {
    let output = if cfg!(target_os = "windows") {
        Command::new("powershell")
            .args(&["-Command", &command])
            .output()
    } else {
        return Err("PowerShell is only available on Windows".to_string());
    };

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).to_string();
            let exit_code = output.status.code();
            let success = output.status.success();

            Ok(CommandResult {
                success,
                stdout,
                stderr,
                exit_code,
            })
        }
        Err(e) => Err(format!("Failed to execute PowerShell command: {}", e)),
    }
}

/// Get system information
#[tauri::command]
pub fn get_system_info() -> Result<String, String> {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    let family = std::env::consts::FAMILY;
    
    Ok(format!(
        "OS: {}\nArchitecture: {}\nFamily: {}",
        os, arch, family
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_system_info() {
        let result = get_system_info();
        assert!(result.is_ok());
        let info = result.unwrap();
        assert!(info.contains("OS:"));
        assert!(info.contains("Architecture:"));
    }

    #[test]
    #[cfg(target_os = "windows")]
    fn test_execute_cmd_command() {
        let result = execute_cmd_command("echo".to_string(), vec!["test".to_string()]);
        assert!(result.is_ok());
        let cmd_result = result.unwrap();
        assert!(cmd_result.success);
        assert!(cmd_result.stdout.contains("test"));
    }
}
