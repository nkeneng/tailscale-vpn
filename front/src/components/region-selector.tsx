import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"

interface Region {
    region: string;
    zone: string;
}

interface RegionSelectorProps {
    regions: Region[];
    selectedRegion: string;
    onRegionSelect: (region: string) => void;
}

export function RegionSelector({ regions, selectedRegion, onRegionSelect }: RegionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as Node).contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const filteredRegions = regions.filter((region) =>
        region.region.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={isOpen}
                className="w-[300px] justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedRegion
                    ? regions.find((region) => region.zone === selectedRegion)?.region
                    : "Select a Linode region"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            {isOpen && (
                <div className="absolute mt-1 w-full z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                    <input
                        type="text"
                        placeholder="Search regions..."
                        className="w-full p-2 border-b border-gray-300 dark:border-gray-700 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="max-h-60 overflow-auto">
                        {filteredRegions.map((region) => (
                            <li
                                key={region.zone}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => {
                                    onRegionSelect(region.zone)
                                    setIsOpen(false)
                                    setSearchTerm("")
                                }}
                            >
                                {region.region}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}