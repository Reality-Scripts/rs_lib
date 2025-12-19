game 'gta5'
fx_version 'cerulean'

use_experimental_fxv2_oal 'yes'

file 'html/**'
ui_page 'html/index.html'

shared_script 'imports/shared/package.lua'

file 'imports/shared/**'
file 'imports/client/**'

file 'resource/shared/**'
file 'resource/client/**'

client_script 'resource/client/init.lua'
server_script 'resource/server/init.lua'

nui_page 'clipboard' 'clipboard.html'

nui_page 'menu' 'menu/index.html'

