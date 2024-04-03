"""
Script to download OSM tiles from Geofabrik.

Tile number needs to be limited to avoid overloading the server.
"""

from pathlib import Path
import shutil
import time
import random
import requests

# Spaceport:
# (32.98950, -106.97509)

# Launch Canada:
# (47.9868850, -81.8484030)

# Tool
# https://tools.geofabrik.de/map/?type=Geofabrik_Standard&grid=1#3/53.0188/-82.7651


def estimate_tile_size(tile_list):
    """
        Estimate the disk size of the tiles
    """
    print("Nombre de tuiles:", len(tile_list))
    print("Taille kb", len(tile_list) * 20)  # 20 kb par tuile
    print("Taille mb", round(len(tile_list) * 20 / 1000))


def get_tiles_between(topleft, botright):
    """
        Get all the tiles between two tiles

        Args:
            topleft: tuple (zoom, x, y)
            botright: tuple (zoom, x, y)

        Returns:
            list of tuples (zoom, x, y)
    """
    tiles = []
    z = topleft[0]
    for x in range(topleft[1], botright[1] + 1):
        for y in range(topleft[2], botright[2] + 1):
            tiles.append((z, x, y))

    return tiles


def download_tiles(tile_list):
    """
        Download all the tiles in the list to ./tiles/

        Args:
            tile_list: list of tuples (zoom, x, y)
    """
    for tile in tile_list:
        # Timeout to not overload the server
        time.sleep((100 + random.randint(-50, 200))/1000)

        # url = f"https://tile.openstreetmap.org/{tile[0]}/{tile[1]}/{tile[2]}.png"
        url = f"https://tile.geofabrik.de/549e80f319af070f8ea8d0f149a149c2/{tile[0]}/{tile[1]}/{tile[2]}.png"
        folder_path = f"./tiles/{tile[0]}/{tile[1]}/"
        file_name = f"./tiles/{tile[0]}/{tile[1]}/{tile[2]}.png"

        print("Url: ", url)

        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "fr-CA,fr-FR;q=0.9,fr;q=0.8,en-CA;q=0.7,en-US;q=0.6,en;q=0.5",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Host": "tile.geofabrik.de",
            "If-None-Match": '"5447ff4a8835abfded2af4ab70ee69e7"',
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"'
        }

        res = requests.get(url, stream=True, headers=headers, timeout=100)

        if res.status_code == 200:
            Path(folder_path).mkdir(parents=True, exist_ok=True)
            with open(file_name, 'wb') as f:
                shutil.copyfileobj(res.raw, f)
            print('Image sucessfully Downloaded: ', file_name)
        else:
            print('Image Couldn\'t be retrieved', res.status_code)


custom_tiles = [(0, 0, 0),
                (1, 0, 0), (1, 1, 0), (1, 0, 1), (1, 1, 1),
                (2, 0, 0), (2, 1, 0), (2, 0, 1), (2, 1, 1),
                (3, 1, 2), (3, 2, 2), (3, 1, 3), (3, 2, 3),
                (4, 2, 5), (4, 3, 5), (4, 4, 5),
                (4, 2, 6), (4, 3, 6), (4, 4, 6),
                (5, 8, 10), (5, 9, 10),
                (5, 8, 11), (5, 9, 11),
                (6, 16, 21), (6, 17, 21), (6, 18, 21), (6, 19, 21),
                (6, 16, 22), (6, 17, 22), (6, 18, 22), (6, 19, 22),
                (6, 16, 23), (6, 17, 23), (6, 18, 23), (6, 19, 23),
                # Québec
                (7, 38, 44), (7, 39, 44),
                (7, 38, 45), (7, 39, 45),
                (8, 76, 89), (8, 77, 89), (8, 78, 89),
                (8, 76, 90), (8, 77, 90), (8, 78, 90),
                (8, 76, 91), (8, 77, 91), (8, 78, 91),
                (9, 153, 179), (9, 154, 179), (9, 155, 179),
                (9, 153, 180), (9, 154, 180), (9, 155, 180),
                (9, 153, 181), (9, 154, 181), (9, 155, 181),
                (10, 308, 360), (10, 309, 360),
                (10, 308, 361), (10, 309, 361),
                (11, 617, 721), (11, 618, 721), (11, 619, 721),
                (11, 617, 722), (11, 618, 722), (11, 619, 722),
                (12, 1235, 1443), (12, 1236, 1443), (12, 1237, 1443),
                (12, 1235, 1444), (12, 1236, 1444), (12, 1237, 1444),
                (13, 2472, 2888), (13, 2473, 2888), (13, 2474, 2888),
                (13, 2472, 2889), (13, 2473, 2889), (13, 2474, 2889),
                *get_tiles_between((14, 4944, 5776), (14, 4949, 5778)),
                *get_tiles_between((15, 9888, 11552), (15, 9899, 11557)),
                # Timmins
                (7, 33, 43), (7, 34, 43), (7, 35, 43),
                (7, 33, 44), (7, 34, 44), (7, 35, 44),
                (7, 33, 45), (7, 34, 45), (7, 35, 45),
                (8, 68, 88), (8, 69, 88), (8, 70, 88),
                (8, 68, 89), (8, 69, 89), (8, 70, 89),
                (9, 138, 177), (9, 139, 177), (9, 140, 177),
                (9, 138, 178), (9, 139, 178), (9, 140, 178),
                (10, 278, 355), (10, 279, 355), (10, 280, 355),
                (10, 278, 356), (10, 279, 356), (10, 280, 356),
                *get_tiles_between((11, 556, 710), (11, 560, 713)),  # 20 km
                *get_tiles_between((12, 1113, 1421),
                                   (12, 1120, 1426)),  # 20 km
                *get_tiles_between((13, 2227, 2843),
                                   (13, 2240, 2852)),  # 20 km
                *get_tiles_between((14, 4455, 5687),
                                   (14, 4480, 5704)),  # 20 km
                *get_tiles_between((15, 8911, 11375),
                                   (15, 8960, 11408)),  # 20 km
                # *get_tiles_between((16, 17823, 22751),
                #                  (16, 17920, 22816)),  # 20 km
                # Nouveau mexique
                (5, 6, 12), (5, 7, 12),
                (5, 6, 13), (5, 7, 13),
                (6, 12, 25), (6, 13, 25),
                (7, 25, 50), (7, 26, 50),
                (7, 25, 51), (7, 26, 51),
                (8, 51, 102), (8, 52, 102),
                (8, 51, 103), (8, 52, 103),
                (9, 103, 205), (9, 104, 205),
                (9, 103, 206), (9, 104, 206),
                (10, 206, 411), (10, 207, 411), (10, 208, 411),
                (10, 206, 412), (10, 207, 412), (10, 208, 412),
                (10, 206, 413), (10, 207, 413), (10, 208, 413),
                *get_tiles_between((11, 413, 823), (11, 417, 826)),  # 20 km
                *get_tiles_between((12, 827, 1647), (12, 834, 1652)),  # 20 km
                *get_tiles_between((13, 1655, 3295),
                                   (13, 1668, 3304)),  # 20 km
                *get_tiles_between((14, 3311, 6591),
                                   (14, 3336, 6608)),  # 20 km
                *get_tiles_between((15, 6623, 13183),
                                   (15, 6672, 13216)),  # 20 km
                # *get_tiles_between((16, 13247, 26367),
                #                  (16, 13344, 26432)),  # 20 km
                ]

# print(custom_tiles)

estimate_tile_size(custom_tiles)

# download_tiles(custom_tiles)
