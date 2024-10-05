import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { LinodeInstance } from "./linode-vpn-setup"

interface InstanceTableProps {
    instances: LinodeInstance[];
    onDeleteInstance: (instanceId: number) => void;
}

export function InstanceTable({ instances, onDeleteInstance }: InstanceTableProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'running':
                return 'bg-green-500';
            case 'booting':
            case 'provisioning':
                return 'bg-orange-500';
            case 'offline':
            case 'stopped':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    }

    const parseOS = (image: string): string => {
        const parts = image.split('/')
        if (parts.length === 2) {
            const [distro, version] = parts[1].split(/(\d+)/)
            return `${distro.charAt(0).toUpperCase() + distro.slice(1)} ${version}`.trim()
        }
        return image
    }

    return (
        <>
            {instances && instances.length > 0 ? (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Linode Instances</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Region</TableHead>
                                <TableHead>Operating System</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {instances.map((instance) => (
                                <TableRow key={instance.id}>
                                    <TableCell>{instance.label}</TableCell>
                                    <TableCell>{instance.region}</TableCell>
                                    <TableCell>{parseOS(instance.image)}</TableCell>
                                    <TableCell>
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(instance.status)}`}></span>
                                        {instance.status}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDeleteInstance(instance.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div>No instances available</div>
            )}
        </>
    )
}