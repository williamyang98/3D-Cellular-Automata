# 3D Cellular Automata
[Live Demo](http://fiendchain.github.io/3D-Cellular-Automata) of website here.

[![3D Cellular Automata](http://img.youtube.com/vi/-sCSQcG2hZM/0.jpg)](http://youtu.be/-sCSQcG2hZM "3D Cellular Automata")

This is based on the youtube video by Softology. The article written by them can be found [here](https://softologyblog.wordpress.com/2019/12/28/3d-cellular-automata-3/), and their video linked below.

[![3D Cellular Automata](http://img.youtube.com/vi/dQJ5aEsP6Fs/0.jpg)](http://youtu.be/dQJ5aEsP6Fs "3D Cellular Automata")

## Explanation
Cellular automata involves changing a collection of cells based on specific rules. Here we have a 3D grid of cells, and the rule is:
1. Depending on the number of surrounding cells it can either:
   - Resurrect a dead cell
   - Kill a living cell
   - Do nothing to the cell (dead or alive)
2. We can have intermediate states where the cell is dying. Here the cell is:
   - Unable to be resurrected
   - Unable to be killed
   - Continues to go from alive (255) to dead (0)
3. We can have different types of surrounding cells
   - Moore neighbourhood considers all surrounding 26 cells in 3D space
   - VonNeumann neighbourhood considers directly adjacent 6 cells in 3D space
Using these rules we can get interesting patterns.

A more detailed explanation can be found [here](https://softologyblog.wordpress.com/2019/12/28/3d-cellular-automata-3/) at Softology's article.

## Instructions
1. Press run to begin the simulation using the floating controls in the middle. 
2. You can pause, reset (clear), and randomise the simulation also using the floating controls.
3. In the rules panel you can change it to a different cellular automata rule by clicking on them. You can switch between different rules in realtime, however it can produce artifacts.
4. In the randomiser panel, you can change how the world is populated.
   - Seed crystal absolute places a blob in the middle with radius in blocks.
   - Seed crystal places a blob in the middle with radius as a fraction of maximum radius.
5. To change how the world is rendered, you can change the parameters in the graphics panel.
   - Renderer can be selected from volume, point, voxel
   - Volume is the fastest but worst quality 
   - Point is slower and has decent quality 
   - Voxel is the slowest and has the best quality (Very intensive)
   - To speed up the simulation, you can disable rendering (show render), and re-enable it later
6. To change the size of the world use the size controls panel. This will adjust the width, length and height of the simulation. (For large sizes this can become very intensive).

## Gallery
![alt text](docs/images/app.PNG "Application")

## Default rules
| | | |
|:---:|:---:|:---:|
| 445 | 678 678 | Amoeba |
| <img src="src/images/445.PNG" alt="445" width="256"> | <img src="src/images/678 678.PNG" alt="678 678" width="256"> | <img src="src/images/amoeba.PNG" alt="Amoeba" width="256"> |
| Builder 1 | Builder 2 | Clouds 1 |
| <img src="src/images/builder-1.PNG" alt="Builder-1" width="256"> | <img src="src/images/builder-2.PNG" alt="Builder-2" width="256"> | <img src="src/images/clouds-1.PNG" alt="Clouds-1" width="256"> |
| Crystal Growth 1 | Crystal Growth 2 | Pyroclastic |
| <img src="src/images/crystal-growth-1.PNG" alt="Crystal-1" width="256"> | <img src="src/images/crystal-growth-2.PNG" alt="Crystal-2" width="256"> | <img src="src/images/pyroclastic.PNG" alt="Pyroclastic" width="256"> |
| Slow Decay | Spikey Growth |
| <img src="src/images/slow-decay.PNG" alt="Slow Decay" width="256"> | <img src="src/images/spikey-growth.PNG" alt="Spikey Growth" width="256"> |

## Combining rules
You can also switch between the rules while it is running, which can create interesting patterns.
| | |
|:---:|:---:|
| Crystal Growth 1 to Crystal Growth 2 | 445 to Crystal Growth 1 |
| <img src="docs/images/crystal-growth-1-2.PNG" alt="Crystal growth 1 to 2" width="256"> | <img src="docs/images/445-crystal-growth-1.PNG" alt="Crystal growth 1 to 2" width="256"> |
