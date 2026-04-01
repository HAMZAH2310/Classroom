import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { UploadWidgetProps, UploadWidgetValue } from "@/types";
import { Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

    // Stabilize the onChange callback
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        setPreview(value);
    }, [value]);

    useEffect(() => {
        if (!window.cloudinary) return;

        widgetRef.current = window.cloudinary.createUploadWidget(
            {
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                apiKey: CLOUDINARY_API_KEY,
                sources: ["local", "url", "camera", "unsplash", "image_search"],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                maxFileSize: 5000000, // 5MB
                styles: {
                    palette: {
                        window: "#FFFFFF",
                        windowBorder: "#90A0B3",
                        tabIcon: "#0078FF",
                        menuIcons: "#5A616A",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#0078FF",
                        action: "#FF620C",
                        inactiveTabIcon: "#0E2F5A",
                        error: "#F44235",
                        inProgress: "#0078FF",
                        complete: "#20B832",
                        sourceBg: "#E4EBF1"
                    },
                }
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    const newValue: UploadWidgetValue = {
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                    };
                    setPreview(newValue);
                    onChangeRef.current?.(newValue);
                }
            }
        );

        // Cleanup on unmount or when dependencies change
        return () => {
            widgetRef.current?.destroy();
            widgetRef.current = null;
        };
    }, []); // Only create once on mount unless constants are truly dynamic

    const openWidget = () => {
        if (!disabled) {
            widgetRef.current?.open();
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onChangeRef.current?.(null);
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="upload-preview-container group">
                    <img
                        src={preview.url}
                        alt="Preview"
                        className="upload-preview-image"
                    />
                    <div className="upload-overlay">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="btn-remove"
                            onClick={handleRemove}
                            disabled={disabled}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Image
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={`upload-dropzone ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={openWidget}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openWidget();
                        }
                    }}
                >
                    <div className="upload-prompt">
                        <UploadCloud className="icon" />
                        <div>
                            <p>Click to upload banner</p>
                            <p>High resolution PNG or JPG (Max 5MB)</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadWidget;