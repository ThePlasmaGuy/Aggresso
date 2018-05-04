> Aggresso

#### Linux Shortcut

Create a file in `~/.local/share/applications/` called `Aggresso.desktop` with the following contents:

```
[Desktop Entry]
Name=Aggresso
Exec=/path/to/Aggresso
Terminal=false
Type=Application
Icon=/path/to/Aggresso/resources/app/assets/Icon.png
```

Replace all instances of `/path/to` with the actual path of the Aggresso app.

## Development

> Made with [Electron](http://electron.atom.io).

<table>
	<tr>
		<td>Init</td>
		<td><code>npm install</code></td>
	</tr>
	<tr>
		<td>Run</td>
		<td><code>npm start</code></td>
	</tr>
	<tr>
		<td>Build</td>
		<td><code>npm run build</code></td>
	</tr>
	<tr>
		<td>Build macOS</td>
		<td><code>npm run build-darwin</code></td>
	</tr>
	<tr>
		<td>Build Windows</td>
		<td><code>npm run build-win32</code></td>
	</tr>
	<tr>
		<td>Build Linux</td>
		<td><code>npm run build-linux</code></td>
	</tr>
</table>

## License

MIT © [TPG](https://PlasmaRobotics.com)
